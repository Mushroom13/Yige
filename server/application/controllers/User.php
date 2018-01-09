<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;

class User extends CI_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->model('UserModel');
    }

    public function index() {
        $result = LoginService::check();

        if ($result['loginState'] === Constants::S_AUTH) {
            $userInfoResult=$result['userinfo'];
            $otherInfo=$this->UserModel->getInfo($userInfoResult['openId']);

            $this->json([
                'code' => 0,
                'data' => $result['userinfo'],
                'age' => $otherInfo['age'],
                'sex' => $otherInfo['sex']
            ]);
        } else {
            $this->json([
                'code' => -1,
                'data' => []
            ]);
        }
    }
}
