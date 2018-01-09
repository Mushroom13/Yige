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
