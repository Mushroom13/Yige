<?php
/**
 * Created by PhpStorm.
 * User: piekey
 * Date: 2018/8/6
 * Time: 22:23
 */

class Match extends CI_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->model('MatchModel');
        $this->load->model('ClotheModel');
    }

    public function uploadCids() {
        //接收post请求，cid列表，用户id
        //新建搭配，并添加cid列表

        //返回成功确认结果
        $cids=explode(" ",$this->input->post('cids'));
        $uid=$this->input->post('uid');
        $img=$this->ClotheModel->getClothe((int)$cids[0])['clotheimg'];
        echo strval($this->MatchModel->addMatch($uid,$cids,$img));
    }

    public function uploadPic()
    {
        //接收请求，是否有图，图片地址，sid
        //如果有图则将图片写入sid项目中
        //返回确认信息
        $sid=$this->input->post('sid');
        $img=$this->input->post('img');
        $this->MatchModel->addPic($sid,$img);
        echo "1";
    }

    public function uploadDetail()
    {
        //接收请求，温度，场景，详情
        //写入数据库
        //返回确认信息
        $sid=$this->input->post('sid');
        $weather=$this->input->post('weather');
        $situation=$this->input->post('situation');
        $detail=$this->input->post('detail');
        $this->MatchModel->addDetail($sid,$weather,$situation,$detail);
        echo "1";
    }

    public function getMatch()
    {
        //接受请求，用户id
        //读取数据库穿搭列表
        //返回给用户
        $uid=$this->input->post('uid');
        $result = $this->MatchModel->getMatch($uid);
        $this->json([
            'code' => 1,
            'data' => $result,
            'length' => count($result)
        ]);
    }
    public function getMatchDetail()
    {
        //接收请求，sid
        //读取搭配列表和详情
        //返回给用户
        $sid=$this->input->post('sid');
        $result = $this->MatchModel->getDetail($sid);
        $this->json([
            'code' => 1,
            'data' => $result
        ]);
    }
}
