<?php
/**
 * Created by PhpStorm.
 * User: piekey
 * Date: 2018/1/9
 * Time: 16:53
 */
class UserModel extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function registerUser($openid,$name,$sex)
    {
        $query = $this->db->get_where('user', array('openid' => $openid));
        $row = $query->row();
        if (isset($row)) return true;
        $data = array(
            'openid' => $openid,
            'nickname' => $name,
            'sex' => $sex,
        );
        if($this->db->insert('user', $data))
        {
            return 'true';
        }
        else
        {
            return $this->db->error();
        }
    }
    public function getInfo($openid)
    {
        $query = $this->db->get_where('user', array('openid' => $openid));
        return $query->row_array();
    }
    public function setAge($openid,$age)
    {
        $data = array(
            'age' => $age,
        );
        return $this->db->update('user',$data,array('openid'=>$openid));
    }
    public function setSex($openid,$sex)
    {
        $data = array(
            'sex' => $sex,
        );
        return $this->db->update('user',$data,array('openid'=>$openid));
    }

}