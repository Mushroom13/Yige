<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Conf as Conf;
use \QCloud_WeApp_SDK\Cos\CosAPI as Cos;
use \QCloud_WeApp_SDK\Constants as Constants;

class Upload extends CI_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->helper("simple_html_dom");
    }
    private function request_by_curl($remote_server, $post_string) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $remote_server);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'tkl=' . $post_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36");
        $data = curl_exec($ch);
        curl_close($ch);

        return $data;
    }
    public function uploadLink()
    {
        $clotheUrl=$this->input->post('clotheUrl');
        $firstletter=substr($clotheUrl,0,1);
        if(preg_match("/^[a-zA-Z]+$/", $firstletter)) {


            if (strpos($clotheUrl, 'http') != 0) {
                $clotheUrl = 'https://' + $clotheUrl;
            }
            try {
                $html = file_get_html($clotheUrl);
                $picUrl = "";
                // 获取网页上的第一张图片
                foreach ($html->find('img') as $element) {
                    $Url = $element->src;
                    if (strrchr($Url, 'jpg') == 'jpg') {
                        if (strpos($Url, '//') == 0) {
                            $picUrl = "http:" . $element->src;
                        } elseif (strpos($Url, 'http') != 0) {
                            $picUrl = "http://" . $element->src;
                        } else {
                            $picUrl = $element->src;
                        }
                        break;
                    }

                }
                if ($picUrl == "") {
                    $this->json([
                        'code' => 0,
                        'error' => "该网页捕捉不到图片"
                    ]);
                } else {
                    //获取淘宝标题
                    $title = $html->find('h3[class=tb-main-title]', 0);
                    if (!$title) {
                        $title = $html->find('h1[data-spm=1000983]', 0);
                    }
                    if (!$title) {
                        $title = '暂无描述';
                    } else {
                        $title = trim($title->innertext);
                    }
                    $encode = mb_detect_encoding($title, array('ASCII', 'UTF-8', 'GB2312', 'GBK', 'BIG5'));
                    $utf8title = mb_convert_encoding($title, "UTF-8", $encode);
                    //将图片保存到本地
                    $img = file_get_contents($picUrl);
                    $filePath = md5(mt_rand()) . '-' . 'img.jpg';
                    file_put_contents($filePath, $img);
                    $file = array(
                        'name' => 'img.jpg',
                        'tmp_name' => $filePath,
                        'size' => filesize($filePath),
                        'type' => 'image/jpg'
                    );
                    $result = $this->uploadToBucket($file);
                    unlink($filePath);
                    $result['data']['title'] = $utf8title;
                    $this->json($result);
                }


            } catch (Exception $e) {
                $this->json([
                    'code' => -1,
                    'error' => $e->__toString()
                ]);
            }
        }
        else{
            try{
                $res=$this->request_by_curl('http://api.chaozhi.hk/tb/tklParse',$clotheUrl );
                $jsondict=json_decode($res,true);
                $data=$jsondict['data'];
                $picUrl=$data['thumb_pic_url'];
                $title=$data['content'];
                $encode = mb_detect_encoding($title, array('ASCII', 'UTF-8', 'GB2312', 'GBK', 'BIG5'));
                $utf8title = mb_convert_encoding($title, "UTF-8", $encode);
                //将图片保存到本地
                $img = file_get_contents($picUrl);
                $filePath = md5(mt_rand()) . '-' . 'img.jpg';
                file_put_contents($filePath, $img);
                $file = array(
                    'name' => 'img.jpg',
                    'tmp_name' => $filePath,
                    'size' => filesize($filePath),
                    'type' => 'image/jpg'
                );
                $result = $this->uploadToBucket($file);
                unlink($filePath);
                $result['data']['title'] = $utf8title;
                $this->json($result);

            }catch (Exception $e) {
                $this->json([
                    'code' => -1,
                    'error' => $e->__toString()
                ]);
            }

        }

    }

    private function uploadToBucket($file)
    {
        $cosClient = Cos::getInstance();
        $cosConfig = Conf::getCos();
        $bucketName = $cosConfig['fileBucket'];
        $folderName = $cosConfig['uploadFolder'];

        try {
            /**
             * 列出 bucket 列表
             * 检查要上传的 bucket 有没有创建
             * 若没有则创建
             */
            $bucketsDetail = $cosClient->listBuckets()->toArray()['Buckets'];
            $bucketNames = [];
            foreach ($bucketsDetail as $bucket) {
                array_push($bucketNames, explode('-', $bucket['Name'])[0]);
            }

            // 若不存在 bucket 就创建 bucket
            if (count($bucketNames) === 0 || !in_array($bucketName, $bucketNames)) {
                $cosClient->createBucket([
                    'Bucket' => $bucketName,
                    'ACL' => 'public-read'
                ])->toArray();
            }

            // 上传文件
            $fileFolder = $folderName ? $folderName . '/' : '';
            $fileKey = $fileFolder . md5(mt_rand()) . '-' . $file['name'];
            $uploadStatus = $cosClient->upload(
                $bucketName,
                $fileKey,
                file_get_contents($file['tmp_name'])
            )->toArray();
            return [
                'code' => 1,
                'data' => [
                    'imgUrl' => $uploadStatus['ObjectURL'],
                    'size' => $file['size'],
                    'mimeType' => $file['type'],
                    'name' => $fileKey,
                ]
            ];

        } catch (Exception $e) {
            return [
                'code' => -1,
                'error' => $e->__toString()
            ];

        }
    }

    public function index() {
        // 处理文件上传
        $file = $_FILES['file']; // 去除 field 值为 file 的文件

        ini_set('upload_max_filesize', '10M');
        ini_set('post_max_size', '10M');

        // 限制文件格式，支持图片上传
        if ($file['type'] !== 'image/jpeg' && $file['type'] !== 'image/jpg' && $file['type'] !== 'image/png') {
            $this->json([
                'code' => 0,
                'error' => '不支持的上传图片类型：' . $file['type']
            ]);
            return;
        }
        
        // 限制文件大小：5M 以内
        if ($file['size'] > 5 * 1024 * 1024) {
            $this->json([
                'code' => 0,
                'error' => '上传图片过大，仅支持 5M 以内的图片上传'
            ]);
            return;
        }
        $result=$this->uploadToBucket($file);
        $this->json($result);
    }
}
