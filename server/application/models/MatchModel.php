<?php
/**
 * Created by PhpStorm.
 * User: piekey
 * Date: 2018/8/6
 * Time: 23:03
 */

class MatchModel extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function addMatch($uid,$cids,$img)
    {
        $this->db->insert('selfmatch', array(
            'uid' => $uid,
            'img'=>$img
        ));
        $sid= $this->db->insert_id();
        foreach ($cids as $cid) {
            $this->db->insert('matchdetail', array(
                'sid' => $sid,
                'cid'=>$cid
            ));
        }
        return $sid;
    }

    public function addPic($sid,$img)
    {
        $data = array(
            'img' => $img,
        );
        return $this->db->update('selfmatch',$data,array('id'=>$sid));
    }

    public function addDetail($sid,$weather,$situation,$detail)
    {
        $data = array(
            'weather' => $weather,
            "situation" => $situation,
            "detail" => $detail
        );
        return $this->db->update('selfmatch',$data,array('id'=>$sid));
    }

    public function getMatch($uid)
    {
        $query = $this->db->get_where('selfmatch', array('uid' => $uid));
        return $query->result_array();
    }

    public function getDetail($sid)
    {
        $query=$this->db->query("select group_concat(clotheimg) as imgs,selfmatch.img,selfmatch.weather,selfmatch.situation,selfmatch.detail from matchdetail,selfmatch,clothe WHERE selfmatch.id=".$sid." and selfmatch.id=matchdetail.sid and matchdetail.cid=clothe.clotheid group by matchdetail.sid");
        return $query->result_array();
    }
}