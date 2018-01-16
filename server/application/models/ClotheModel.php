<?php
/**
 * Created by PhpStorm.
 * User: Mushroom
 * Date: 2018/1/15
 * Time: 20:14
 */
class ClotheModel extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function addclothe($openid,$url)
    {
        $data = array(
            'clotheimg' => $url,
        );
        if($this->db->insert('clothe', $data))
        {
            $cid= $this->db->insert_id();

            $this->db->insert('clothespress', array(
                'openid' => $openid,
                'clotheid' => $cid,
            ));
            return $cid;
        }
        else
        {
            return -1;
        }
    }
    public function getclothe($clotheid){
        $query = $this->db->get_where('clothe', array('clotheid' => $clotheid));
        return $query->row_array();
    }
    public function setlocation($clotheid,$location){
        $data = array(
            'location' => $location,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }
    public function settype($clotheid,$type){
        $data = array(
            'clothetype' => $type,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }
    public function setseason($clotheid,$season){
        $data = array(
            'clotheseason' => $season,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }
    public function setcolor($clotheid,$color){
        $data = array(
            'clothecolor' => $color,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }
    public function setstar($clotheid,$key){
        $data = array(
            'clothestar' => $key,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }
}