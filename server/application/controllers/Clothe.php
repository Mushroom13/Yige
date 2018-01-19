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

}
