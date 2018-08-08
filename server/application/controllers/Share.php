<?php
/**
 * Created by PhpStorm.
 * User: piekey
 * Date: 2018/8/7
 * Time: 16:34
 */

class Share extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('ShareModel');
    }
    public function addShare()
    {
        $uid=$this->input->post('uid');
        $img=$this->input->post('img');
        echo $this->ShareModel->addShare($uid,$img);
    }
    public function getShare()
    {
        $sid=$this->input->post('sid');
        $img=$this->ShareModel->getShare($sid)['img'];
        echo $img;
    }
}