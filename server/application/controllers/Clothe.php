<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;

class Clothe extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('ClotheModel');
    }

    public function clotheDetail()
    {
        $clotheid = $this->input->post('clotheid');
        $clothedata = $this->ClotheModel->getclothe($clotheid);
        $recommendData = $this->ClotheModel->getRecommend($clotheid);
        $this->json([
            'code' => 1,
            'data' => $clothedata,
            'recommendData' => $recommendData
        ]);
    }

    private function getColorNum($filepath)
    {
        if (substr($filepath, 0, strlen('png')) === 'png') {
            $i = imagecreatefrompng($filepath);
        } else $i = imagecreatefromjpeg($filepath);
        $r=0;
        $g=0;
        $b=0;
        $pointNum=0;
        for ($x = intval(imagesx($i) * 0.2); $x < intval(imagesx($i) * 0.8); $x++) {
            for ($y = intval(imagesy($i) * 0.2); $y < intval(imagesy($i) * 0.8); $y++) {
                $rgb  = imagecolorat($i, $x, $y);
                $r += ($rgb  >> 16) & 0xFF;
                $g += ($rgb  >> 8) & 0xFF;
                $b += $rgb  & 0xFF;
                $pointNum++;
            }
        }
        $r/=$pointNum;
        $g/=$pointNum;
        $b/=$pointNum;
        $standardColor=array();
        $standardColor[]=array(0,0,0);
        $standardColor[]=array(255,255,255);
        $standardColor[]=array(128,128,128);
        $standardColor[]=array(255,0,0);
        $standardColor[]=array(139,69,19);
        $standardColor[]=array(255,165,0);
        $standardColor[]=array(255,255,0);
        $standardColor[]=array(0,128,0);
        $standardColor[]=array(0,0,255);
        $standardColor[]=array(128,0,128);
        $min=9999999;
        $colorNum=-1;
        for($i=0;$i<10;$i++){
            $temp=pow($r-$standardColor[$i][0],2)+pow($g-$standardColor[$i][1],2)+pow($b-$standardColor[$i][2],2);
            if($temp<$min){
                $colorNum=$i;
                $min=$temp;
            }
        }
//        echo $r.' '.$g.' '.$b;
        return [$colorNum,$r,$g,$b];
    }

    public function addClothe()
    {
        $openid = $this->input->post('openid');
        $url = $this->input->post('url');
        $title = $this->input->post('title');
        $img = file_get_contents($url);
        $filePath = md5(mt_rand()) . '-' . 'img.jpg';
        file_put_contents($filePath, $img);
       if ($title != '暂无描述') {
            if (strstr($title, '上衣')||strstr($title, '短袖')||strstr($title, '长袖')) {
                $type = 0;
            } elseif (strstr($title, '裤')) {
                $type = 1;
            } elseif (strstr($title, '外套')) {
                $type = 2;
            } elseif (strstr($title, '裙')) {
                $type = 3;
            } elseif (strstr($title, '鞋')) {
                $type = 4;
            } else {
                $type = 5;
            }
           if (strstr($title, '夏')||strstr($title, '短袖')) {
               $season = 1;
           } elseif (strstr($title, '冬')||strstr($title, '长袖')) {
               $season = 2;
           } else {
               $season = 3;
           }
            $colorResult=$this->getColorNum($filePath);
            $color=$colorResult[0];
            $r=$colorResult[1];
            $g=$colorResult[2];
            $b=$colorResult[3];
        }
        else {
            //$type=shell_exec('getType'); 大bug
            $typeResult = shell_exec('./run_getType.sh /usr/local/MATLAB/MATLAB_Runtime/v91 ' . $filePath);
            $type = intval(substr($typeResult, -1, 1));
            if ($type == 0) {
                $type = 3;
                $season = 1;
            } elseif ($type == 1) {
                $type = 1;
                $season = 1;
            } elseif ($type == 2) {
                $type = 1;
                $season = 2;
            } elseif ($type == 3) {
                $type = 0;
                $season = 1;
            } elseif ($type == 4) {
                $type = 0;
                $season = 2;
            } elseif ($type == 5) {
                $type = 2;
                $season = 2;
            } elseif ($type == 6) {
                $type = 4;
                $season = 3;
            }
            $colorResult=$this->getColorNum($filePath);
            $color=$colorResult[0];
            $r=$colorResult[1];
            $g=$colorResult[2];
            $b=$colorResult[3];
        }

        //unlink($filePath);
        $cid = $this->ClotheModel->addclothe($openid, $url, $title, $type, $color, $season,$r,$g,$b);
        if ($cid != -1) {
            $this->json([
                'result'=>1,
                'cid' => $cid,
                'filepath' => $filePath
            ]);
        } else {
            $this->json([
                'result'=>0,
                'error'=>'系统错误'
            ]);
        }
    }

    public function getRecommend(){
        $clotheid = $this->input->post('clotheid');
        $clothe=$this->ClotheModel->getclothe($clotheid);
        $filePath = $this->input->post('filepath');
        $hogResult = shell_exec('./run_getFeature.sh /usr/local/MATLAB/MATLAB_Runtime/v91 ' . $filePath);
        $hog =substr($hogResult, 315);
        $this->ClotheModel->setHog($clotheid,$hog);
        $r=$clothe['r'];
        $g=$clothe['g'];
        $b=$clothe['b'];
        $hog=explode(' ',$hog);
        $ihog=array();
        foreach ($hog as $f)
        {
            $ihog[]=floatval($f);
        }
        $json_string = file_get_contents("result.json");
        $data = json_decode($json_string,true);
        $hoglist=array();
        foreach ($data as $t) {
            if(pow($r-$t['r'],2)+pow($g-$t['g'],2)+pow($b-$t['b'],2)<=7000){
                $hogtemp=array();
                $hogtemp['i']=$t['i'];
                $hogtemp['j']=$t['j'];
                $hogtemp['k']=$t['k'];
                $distance=0;
                for($i=0;$i<1764;$i++) {
                    $distance += pow($ihog[$i] - $t['hog'][$i], 2);
                }
                $hogtemp['distance']=$distance;
                $hoglist[]=$hogtemp;
            }
        }
        for($i=0;$i<count($hoglist)-1;$i++){
            $mp=$i;
            for($j=$i+1;$j<count($hoglist);$j++){
                if($hoglist[$j]['distance']<$hoglist[$mp]['distance'])
                    $mp=$j;
            }
            $min=$hoglist[$mp];
            $hoglist[$mp]=$hoglist[$i];
            $hoglist[$i]=$min;
        }
        if(count($hoglist)>2){
            for($i=0;$i<3;$i++){
                $this->ClotheModel->addRecommend($clotheid,$hoglist[$i]['i'],$hoglist[$i]['j'],$hoglist[$i]['k']);
            }
        }
        else {
            for ($i = 0; $i < count($hoglist); $i++) {
                $this->ClotheModel->addRecommend($clotheid, $hoglist[$i]['i'], $hoglist[$i]['j'], $hoglist[$i]['k']);
            }
        }
        unlink($filePath);
        echo 'finish';
    }
    public function getMyLike()
    {
        $openid = $this->input->post('openid');
        $all = $this->ClotheModel->getMyLike($openid);
        $this->json([
            'code' => 1,
            'data' => $all,
            'length' => count($all)
        ]);
    }

    public function getAll()
    {
        $openid = $this->input->post('openid');
        $all = $this->ClotheModel->getAll($openid);
        $this->json([
            'code' => 1,
            'data' => $all,
            'length' => count($all)
        ]);

    }

    public function setlocation()
    {
        $clotheid = $this->input->post('clotheid');
        $location = $this->input->post('location');
        if ($this->ClotheModel->setlocation($clotheid, $location)) {
            echo 'true:1';
        } else {
            echo 'false:更新失败';
        }
    }

    public function setType()
    {
        $clotheid = $this->input->post('clotheid');
        $type = $this->input->post('clothetype');
        if ($this->ClotheModel->settype($clotheid, $type)) {
            echo 'true:1';
        } else {
            echo 'false:更新失败';
        }
    }

    public function setDetail()
    {
        $clotheid = $this->input->post('clotheid');
        $detail = $this->input->post('clothedetail');
        if ($this->ClotheModel->setdetail($clotheid, $detail)) {
            echo 'true:1';
        } else {
            echo 'false:更新失败';
        }
    }

    public function setSeason()
    {
        $clotheid = $this->input->post('clotheid');
        $season = $this->input->post('clotheseason');
        if ($this->ClotheModel->setseason($clotheid, $season)) {
            echo 'true:1';
        } else {
            echo 'false:更新失败';
        }
    }

    public function setColor()
    {
        $clotheid = $this->input->post('clotheid');
        $color = $this->input->post('clothecolor');
        if ($this->ClotheModel->setcolor($clotheid, $color)) {
            echo 'true:1';
        } else {
            echo 'false:更新失败';
        }
    }

    public function setStar()
    {
        $clotheid = $this->input->post('clotheid');
        $key = $this->input->post('clothestar');
        if ($this->ClotheModel->setstar($clotheid, $key)) {
            echo 'true:1';
        } else {
            echo 'false:更新失败';
        }
    }

    public function delete()
    {
        $openid = $this->input->post('openid');
        $clotheid = $this->input->post('clotheid');
        if ($this->ClotheModel->delete($openid, $clotheid)) {
            echo 'true:1';
        } else {
            echo 'false:删除失败';
        }
    }

    public function getResult()
    {
        $openid = $this->input->post('openid');
        $value = $this->input->post('value');
        $location = $this->input->post('currentTab');
        $keys = explode(",", $this->input->post('keys'));
        $seasonflag = 0;
        $colorflag = 0;
        $typeflag = 0;
        foreach ($keys as $key) {
            if ($key == '春') {
                $seasonkey = 0;
                $seasonflag++;
            }
            if ($key == '夏') {
                $seasonkey = 1;
                $seasonflag++;
            }
            if ($key == '秋') {
                $seasonkey = 0;
                $seasonflag++;
            }
            if ($key == '冬') {
                $seasonkey = 2;
                $seasonflag++;
            }

            if ($key == '上衣') {
                $typekey = 0;
                $typeflag++;
            }
            if ($key == '裤子') {
                $typekey = 1;
                $typeflag++;
            }
            if ($key == '外套') {
                $typekey = 2;
                $typeflag++;
            }
            if ($key == '鞋子') {
                $typekey = 3;
                $typeflag++;
            }
            if ($key == '其他') {
                $typekey = 4;
                $typeflag++;
            }

            if ($key == '黑') {
                $colorkey = 0;
                $colorflag++;
            }
            if ($key == '白') {
                $colorkey = 1;
                $colorflag++;
            }
            if ($key == '灰') {
                $colorkey = 2;
                $colorflag++;
            }
            if ($key == '红') {
                $colorkey = 3;
                $colorflag++;
            }
            if ($key == '棕') {
                $colorkey = 4;
                $colorflag++;
            }
            if ($key == '橙') {
                $colorkey = 5;
                $colorflag++;
            }
            if ($key == '黄') {
                $colorkey = 6;
                $colorflag++;
            }
            if ($key == '绿') {
                $colorkey = 7;
                $colorflag++;
            }
            if ($key == '蓝') {
                $colorkey = 8;
                $colorflag++;
            }
            if ($key == '紫') {
                $colorkey = 9;
                $colorflag++;
            }

        }
        if ($seasonflag != 1)
            $seasonkey = -1;
        if ($colorflag != 1)
            $colorkey = -1;
        if ($typeflag != 1)
            $typekey = -1;
        $result = $this->ClotheModel->getResult($openid, $value, $location, $seasonkey, $colorkey, $typekey);
        $this->json([
            'code' => 1,
            'data' => $result,
            'length' => count($result)
        ]);

    }


}
