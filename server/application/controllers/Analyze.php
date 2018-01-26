<?php

class Analyze extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('AnalyzeModel');
    }
    public function getTypeData(){
        $openid=$this->input->post('openid');
        $type_data=$this->AnalyzeModel->getTypeData($openid);
        $this->json([
            'code' => 1,
            'data' => $type_data,
        ]);
    }
    public function getSeasonData(){
        $openid=$this->input->post('openid');
        $season_data=$this->AnalyzeModel->getSeasonData($openid);
        $this->json([
            'code' => 1,
            'data' => $season_data,
        ]);
    }
    public function getColorData(){
        $openid=$this->input->post('openid');
        $color_data=$this->AnalyzeModel->getColorData($openid);
        $this->json([
            'code' => 1,
            'data' => $color_data,
        ]);
    }
}