<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;

class Clothe extends CI_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->model('ClotheModel');
    }
    public function clotheDetail(){
        $clotheid=$this->input->post('clotheid');
        $clothedata=$this->ClotheModel->getclothe($clotheid);
        $this->json([
            'code' => 1,
            'data' => $clothedata
        ]);
    }
    public function addClothe()
    {
        $openid=$this->input->post('openid');
        $url=$this->input->post('url');
        $title=$this->input->post('title');
        $cid=$this->ClotheModel->addclothe($openid,$url,$title);
        if($cid!=-1)
        {
            echo 'true:'.$cid;
        }
        else
        {
            echo 'false:系统错误';
        }
    }
    public function getMyLike()
    {
        $openid=$this->input->post('openid');
        $all=$this->ClotheModel->getMyLike($openid);
        $this->json([
            'code' => 1,
            'data' => $all,
            'length' => count($all)
        ]);
    }

    public function getAll()
    {
        $openid=$this->input->post('openid');
        $all=$this->ClotheModel->getAll($openid);
        $this->json([
            'code' => 1,
            'data' => $all,
            'length' => count($all)
        ]);

    }

    public function setlocation()
    {
        $clotheid=$this->input->post('clotheid');
        $location=$this->input->post('location');
        if($this->ClotheModel->setlocation($clotheid,$location))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:更新失败';
        }
    }
    public function setType()
    {
        $clotheid=$this->input->post('clotheid');
        $type=$this->input->post('clothetype');
        if($this->ClotheModel->settype($clotheid,$type))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:更新失败';
        }
    }
    public function setDetail()
    {
        $clotheid=$this->input->post('clotheid');
        $detail=$this->input->post('clothedetail');
        if($this->ClotheModel->setdetail($clotheid,$detail))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:更新失败';
        }
    }
    public function setSeason()
    {
        $clotheid=$this->input->post('clotheid');
        $season=$this->input->post('clotheseason');
        if($this->ClotheModel->setseason($clotheid,$season))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:更新失败';
        }
    }
    public function setColor()
    {
        $clotheid=$this->input->post('clotheid');
        $color=$this->input->post('clothecolor');
        if($this->ClotheModel->setcolor($clotheid,$color))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:更新失败';
        }
    }
    public function setStar()
    {
        $clotheid=$this->input->post('clotheid');
        $key=$this->input->post('clothestar');
        if($this->ClotheModel->setstar($clotheid,$key))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:更新失败';
        }
    }
    public function delete(){
        $openid=$this->input->post('openid');
        $clotheid=$this->input->post('clotheid');
        if($this->ClotheModel->delete($openid,$clotheid))
        {
            echo 'true:1';
        }
        else
        {
            echo 'false:删除失败';
        }
    }
    public function getResult()
    {
        $openid=$this->input->post('openid');
        $value=$this->input->post('value');
        $location=$this->input->post('currentTab');
        $keys=explode(",",$this->input->post('keys'));
        $seasonflag=0;
        $colorflag=0;
        $typeflag=0;
        foreach ($keys as $key)
        {
            if($key=='春')
            {
                $seasonkey=0;
                $seasonflag++;
            }
            if($key=='夏')
            {
                $seasonkey=1;
                $seasonflag++;
            }
            if($key=='秋')
            {
                $seasonkey=0;
                $seasonflag++;
            }
            if($key=='冬')
            {
                $seasonkey=2;
                $seasonflag++;
            }

            if($key=='上衣')
            {
                $typekey=0;
                $typeflag++;
            }
            if($key=='裤子')
            {
                $typekey=1;
                $typeflag++;
            }
            if($key=='外套')
            {
                $typekey=2;
                $typeflag++;
            }
            if($key=='鞋子')
            {
                $typekey=3;
                $typeflag++;
            }
            if($key=='其他')
            {
                $typekey=4;
                $typeflag++;
            }

            if($key=='黑')
            {
                $colorkey=0;
                $colorflag++;
            }
            if($key=='白')
            {
                $colorkey=1;
                $colorflag++;
            }
            if($key=='灰')
            {
                $colorkey=2;
                $colorflag++;
            }
            if($key=='红')
            {
                $colorkey=3;
                $colorflag++;
            }
            if($key=='棕')
            {
                $colorkey=4;
                $colorflag++;
            }
            if($key=='橙')
            {
                $colorkey=5;
                $colorflag++;
            }
            if($key=='黄')
            {
                $colorkey=6;
                $colorflag++;
            }
            if($key=='绿')
            {
                $colorkey=7;
                $colorflag++;
            }
            if($key=='蓝')
            {
                $colorkey=8;
                $colorflag++;
            }
            if($key=='紫')
            {
                $colorkey=9;
                $colorflag++;
            }

        }
        if($seasonflag!=1)
            $seasonkey=-1;
        if($colorflag!=1)
            $colorkey=-1;
        if($typeflag!=1)
            $typekey=-1;
        $result=$this->ClotheModel->getResult($openid,$value,$location,$seasonkey,$colorkey,$typekey);
        $this->json([
            'code' => 1,
            'data' => $result,
            'length' => count($result)
        ]);

    }
}
