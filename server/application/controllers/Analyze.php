<?php

class Analyze extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('AnalyzeModel');
    }
    private function httpGet($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        // 终止从服务端进行验证
        // 如需设置为 TRUE，建议参考如下解决方案：
        // https://stackoverflow.com/questions/18971983/curl-requires-curlopt-ssl-verifypeer-false
        // https://stackoverflow.com/questions/6324391/php-curl-setoptch-curlopt-ssl-verifypeer-false-too-slow
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        $output=curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    public function getWeather()
    {
        $latitude=$this->input->post('latitude');
        $longitude=$this->input->post('longitude');//经度

        $param['location'] =  $latitude.','.$longitude;// 开始日期。0 = 今天天气
        $param['key'] = 'OGRBZ-ZMQCG-EZ3QE-IMQI4-QKJ4S-XOB6U'; // 查询天数，1 = 只查一天

        $url = 'http://apis.map.qq.com/ws/geocoder/v1/?' . http_build_query($param);

        $cityResult= json_decode($this->httpGet($url),true);
        $city=$cityResult['result']['ad_info']['city'];

        // 心知天气接口调用凭据
        $key = 'usdovbhid6b8cgtv';
        $uid = 'U8B5089C7A';

        $api = 'https://api.seniverse.com/v3/weather/daily.json';
        $location = $city; // 城市名称

        $param = [
            'ts' => time(),
            'ttl' => 300,
            'uid' => $uid,
        ];
        $sig_data = http_build_query($param);

        $sig = base64_encode(hash_hmac('sha1', $sig_data, $key, TRUE));

        $param['sig'] = $sig; // 签名
        $param['location'] = $location;
        $param['start'] = 0; // 开始日期。0 = 今天天气
        $param['days'] = 1; // 查询天数，1 = 只查一天

        $url = $api . '?' . http_build_query($param);
        $weatherResult= json_decode($this->httpGet($url),true);
      //  var_dump($weatherResult);
        $this->json([
            'code' => 1,
            'low' => $weatherResult['results'][0]['daily'][0]['low'],
            'high' => $weatherResult['results'][0]['daily'][0]['high'],
            'city' => $city
        ]);
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