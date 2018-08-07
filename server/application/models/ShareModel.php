<?php
/**
 * Created by PhpStorm.
 * User: piekey
 * Date: 2018/8/7
 * Time: 16:35
 */


class ShareModel extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function addShare($uid, $img)
    {
        $this->db->insert('share', array(
            'uid' => $uid,
            'img' => $img
        ));
        $sid = $this->db->insert_id();
        return $sid;
    }

}