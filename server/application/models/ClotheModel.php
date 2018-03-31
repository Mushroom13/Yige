<?php

class ClotheModel extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function addclothe($openid,$url,$title,$type,$color,$season,$r,$g,$b)
    {
        $data = array(
            'clotheimg' => $url,
            'clothedetail' => $title,
            'clothetype'=> $type,
            'clothecolor'=> $color,
            'clotheseason'=>$season,
            'r'=>$r,
            'g'=>$g,
            'b'=>$b
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
    public function setHog($clotheid,$hog){
        $data = array(
            'hog' => $hog,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }
    public function addRecommend($clotheid,$i,$j,$k){
        $this->db->insert('clotherecommend', array(
            'clotheid' => $clotheid,
            'i'=>$i,
            'j'=>$j,
            'k'=>$k
        ));
    }
    public function getRecommend($clotheid){
        $query=$this->db->query("SELECT i FROM `clotherecommend` WHERE clotheid=".$clotheid);
        return $query->result_array();
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
    public function setdetail($clotheid,$detail){
        $data = array(
            'clothedetail' => $detail,
        );
        return $this->db->update('clothe',$data,array('clotheid'=>$clotheid));
    }

    public function getAll($openid){
        $query=$this->db->query("SELECT clothe.* FROM clothe , clothespress WHERE openid='".$openid."' AND clothe.clotheid=clothespress.clotheid");
        return $query->result_array();
    }

    public function getMyLike($openid){
        $query=$this->db->query("SELECT clothe.clotheid as cid,clothe.clotheimg as img FROM clothe , clothespress WHERE openid='".$openid."' AND clothe.clotheid=clothespress.clotheid AND clothe.location=1 ORDER BY clothe.clothestar DESC LIMIT 0,5");
        return $query->result_array();
    }

    public function delete($openid,$clotheid){
        return $this->db->query("DELETE FROM clothespress WHERE openid='".$openid."' AND '".$clotheid."'=clothespress.clotheid");
    }
    public function getResult($openid,$value,$location,$seasonkey,$colorkey,$typekey){

        $q1="SELECT clothe.* FROM clothe , clothespress WHERE openid='".$openid."' AND clothe.clotheid=clothespress.clotheid 
        AND clothe.location='".$location."' AND (";
        $q2="1";
        $q3="1";
        $q4="1";
        $q5=" OR clothe.clothedetail like '%".$value."%')";
        if($colorkey!=-1)
        {
            $q2="clothe.clothecolor='".$colorkey."' ";
        }
        if($seasonkey!=-1)
        {
            $q3="clothe.clotheseason='".$seasonkey."' ";
        }
        if($typekey!=-1)
        {
            $q4="clothe.clothetype='".$typekey."' ";
        }
        if($colorkey==-1 and $seasonkey==-1 and $typekey==-1 )
        {
            $q5=" AND  clothe.clothedetail like '%".$value."%')";
        }
        $q=$q1.$q2.' AND '.$q3.' AND '.$q4.$q5;

        $query=$this->db->query($q);
        return $query->result_array();

    }
}