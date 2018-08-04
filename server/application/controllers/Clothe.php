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
    public function recommendDetail(){
        $ri=$this->input->post('ri');
        $rj=$this->input->post('rj');
        $rk=$this->input->post('rk');
        $openid=$this->input->post('openid');
        $json_string = file_get_contents("result.json");
        $resultJsonData = json_decode($json_string,true);
        $myAllClothes=$this->ClotheModel->getAll($openid);
        for($i=0;$i<count($myAllClothes);$i++)
        {
            $clothe=$myAllClothes[$i];
            $hogtemp=explode(' ',$clothe['hog']);
            $ihog=array();
            foreach ($hogtemp as $f)
            {
                $ihog[]=floatval($f);
            }
            $myAllClothes[$i]['hog']=$ihog;
        }

        $recommendArray=array();
        foreach ($resultJsonData as $t) {
            if($t['i']==$ri && $t['j']!=$rj && $t['k']==$rk) {
                $tempFeatureArray = array();
                $r = $t['r'];
                $g = $t['g'];
                $b = $t['b'];
                $hog = $t['hog'];
                $type = $t['type'];
                if ($type == 0) {
                    $type = 3;
                } elseif ($type == 1) {
                    $type = 1;
                } elseif ($type == 2) {
                    $type = 1;
                } elseif ($type == 3) {
                    $type = 0;
                } elseif ($type == 4) {
                    $type = 0;
                } elseif ($type == 5) {
                    $type = 2;
                } elseif ($type == 6) {
                    $type = 4;
                }
                foreach ($myAllClothes as $clothe) {
                    if (pow($r - $clothe['r'], 2) + pow($g - $clothe['g'], 2) + pow($b - $clothe['b'], 2) <= 3000 && $type == $clothe['clothetype']) {
                        $distance = 0;
                        $tempFeature = array();
                        $tempFeature['cid'] = $clothe['clotheid'];
                        $tempFeature['img'] = $clothe['clotheimg'];

                        for ($i = 0; $i < 1764; $i++) {
                            $distance += pow($hog[$i] - $clothe['hog'][$i], 2);
                        }
                        if($distance < 31)
                        {
                            $tempFeature['distance'] = $distance;
                            $tempFeatureArray[] = $tempFeature;
                        }

                    }
                }
                $flen = count($tempFeatureArray) > 2 ? 3 : count($tempFeatureArray);
                for ($i = 0; $i < $flen; $i++) {
                    $mp = $i;
                    for ($j = $i + 1; $j < count($tempFeatureArray); $j++) {
                        if ($tempFeatureArray[$j]['distance'] < $tempFeatureArray[$mp]['distance'])
                            $mp = $j;
                    }
                    $min = $tempFeatureArray[$mp];
                    $tempFeatureArray[$mp] = $tempFeatureArray[$i];
                    $tempFeatureArray[$i] = $min;
                }
                if($flen!=0)
                    $recommendArray[] = array_slice($tempFeatureArray, 0, $flen);

            }
        }
        if (count($recommendArray) != 0) {
            $this->json([
                'code'=>1,
                'recommends' => $recommendArray
            ]);
        } else {
            $this->json([
                'code'=>0,
                'error'=>'你衣服太少了'
            ]);
        }
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
        for ($x = intval(imagesx($i) * 0.25); $x < intval(imagesx($i) * 0.75); $x++) {
            for ($y = intval(imagesy($i) * 0.25); $y < intval(imagesy($i) * 0.75); $y++) {
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
        $standardColor[]=array(0,0,0);//黑0
        $standardColor[]=array(255,255,255);//白1
        $standardColor[]=array(128,128,128);//灰2
        $standardColor[]=array(255,0,0);//红3
        $standardColor[]=array(255,120,120);//红4
        $standardColor[]=array(139,69,19);//棕5
        $standardColor[]=array(96,36,26);//棕6
        $standardColor[]=array(255,165,0);//橙7
        $standardColor[]=array(255,80,0);//橙8
        $standardColor[]=array(255,255,0);//黄9
        $standardColor[]=array(255,255,125);//黄10
        $standardColor[]=array(0,128,0);//绿11
        $standardColor[]=array(0,255,0);//绿12
        $standardColor[]=array(0,0,255);//蓝13
        $standardColor[]=array(0,255,255);//蓝14
        $standardColor[]=array(128,0,128);//紫15
        $standardColor[]=array(190,70,190);//紫16

        $min=9999999;
        $colorNum=-1;
        $tempColorNum=-1;
        for($i=0;$i<10;$i++){
            $temp=pow($r-$standardColor[$i][0],2)+pow($g-$standardColor[$i][1],2)+pow($b-$standardColor[$i][2],2);
            if($temp<$min){
                $tempColorNum=$i;
                $min=$temp;
            }
        }
        if($tempColorNum==0)
            $colorNum=0;
       elseif($tempColorNum==1)
            $colorNum=1;
        elseif($tempColorNum==2)
            $colorNum=2;
        elseif($tempColorNum==3 || 4)
            $colorNum=3;
        elseif($tempColorNum==5 || 6)
            $colorNum=4;
        elseif($tempColorNum==7 || 8)
            $colorNum=5;
        elseif($tempColorNum==9 || 10)
            $colorNum=6;
        elseif($tempColorNum==11 || 12)
            $colorNum=7;
        elseif($tempColorNum==13 || 14)
            $colorNum=8;
        elseif($tempColorNum==15 || 16)
            $colorNum=9;
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
        $type=$clothe['clothetype'];
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
            if ($t['type'] == 0) {
                $t['type'] = 3;
            } elseif ($t['type'] == 1) {
                $t['type'] = 1;
            } elseif ($t['type'] == 2) {
                $t['type'] = 1;
            } elseif ($t['type'] == 3) {
                $t['type'] = 0;
            } elseif ($t['type'] == 4) {
                $t['type'] = 0;
            } elseif ($t['type'] == 5) {
                $t['type'] = 2;
            } elseif ($t['type'] == 6) {
                $t['type'] = 4;
            }
            if(pow($r-$t['r'],2)+pow($g-$t['g'],2)+pow($b-$t['b'],2)<=3000 && $type==$t['type']){
                $hogtemp=array();
                $hogtemp['i']=$t['i'];
                $hogtemp['j']=$t['j'];
                $hogtemp['k']=$t['k'];
                $distance=0;
                for($i=0;$i<1764;$i++) {
                    $distance += pow($ihog[$i] - $t['hog'][$i], 2);
                }
                if($distance<31)
                {
                    $hogtemp['distance']=$distance;
                    $hoglist[]=$hogtemp;
                }
            }
        }
        for($i=0;$i<(count($hoglist)>2?3:count($hoglist));$i++){
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
        $all = $this->ClotheModel->getAll2($openid);
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

    public function getSeasonClothe()
    {
        $openid = $this->input->post('openid');
        $season = $this->input->post('season');
        if($season=='春秋装')
            $seasonkey=0;
        if($season=='春秋装+薄外套')
            $seasonkey=0;
        if($season=='夏装')
            $seasonkey=1;
        if($season=='冬装')
            $seasonkey=2;
        if($season=='冬装+外套')
            $seasonkey=2;
        $result = $this->ClotheModel->getSeasonClothe($openid, $seasonkey);
        $this->json([
            'code' => 1,
            'data' => $result,
            'length' => count($result)
        ]);
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
            if ($key == '裙子') {
                $typekey = 3;
                $typeflag++;
            }
            if ($key == '鞋子') {
                $typekey = 4;
                $typeflag++;
            }
            if ($key == '其他') {
                $typekey = 5;
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
