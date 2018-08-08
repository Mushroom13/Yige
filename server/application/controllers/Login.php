<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;

class Login extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('UserModel');
    }


    public function getOpenid()
    {
        $js_code = $this->input->get('code');
        if(empty($js_code)) return array('status'=>0,'info'=>'缺少js_code');

        $appid = 'wx7d40498f333efe4e';
        $appsecret = 'a5b27a6e61645049affc9fcd7071d837';
        $curl = 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code';
        $curl = sprintf($curl,$appid,$appsecret,$js_code);
        $result = file_get_contents($curl);
        $this->json([
            'status' => 1,
            'info' => json_decode($result,true)
        ]);

    }

    public function index() {
        $result = LoginService::login();
        
        if ($result['loginState'] === Constants::S_AUTH) {
            //$userInfoResult=json_decode($result['userinfo'], true);
            //$userInfoResult=$result['userinfo'];
            $userInfoResult=$result['userinfo']['userinfo'];

            $this->UserModel->registerUser($userInfoResult->{'openId'},$userInfoResult->{'nickName'},$userInfoResult->{'gender'});
            //$userInfoResult['age']=0;
            //$userInfoResult['sex']=$userInfoResult['gender'];
            //$resultJson=json_encode($userInfoResult);
            $this->json([
                'code' => 0,
                'data' => $result['userinfo']
            ]);
        } else {
            $this->json([
                'code' => -1,
                'error' => $result['error']
            ]);
        }
    }
}
