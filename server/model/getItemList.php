<?php
  include('../lib/baidu_transapi.php');

  $origin = '';
  $lang = '';

  if (!function_exists('getallheaders')) {
    $origin = $_SERVER['HTTP_ORIGIN'];

    $lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
  } else {
    $headers = getallheaders();
    $referer = $headers['Referer'];

    preg_match('/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/', $referer, $args);

    $origin = $args[1] . '://' . $args[2] . (isset($args[3]) ? $args[3] : '' );

    $lang = $headers['Accept-Language'];
  }

  header('Access-Control-Allow-Origin: ' . $origin);
  
  // 允许跨域携带 cookie
  header('Access-Control-Allow-Credentials: true');

  // 随机数组
  function array_random_assoc($arr, $num = 1) {
    $keys = array_keys($arr);

    shuffle($keys);
      
    $r = array();
    
    for ($i = 0; $i < $num; $i++) {
      array_push($r, $arr[$keys[$i]]);
    }
    
    return $r;
  }

  $arr = array(
    array(
      'img' => '../_img/pic_01.jpg',
      'name' => 'Joyce Jonathan Asian Tour 2016 In Beijing',
      'stamp' => 1470905310784,
      'venue' => 'Guangdong Performing Arts Center',
      'price' => '￥160-￥580'
    ),
    array(
      'img' => '../_img/pic_02.jpg',
      'name' => 'Joyce Jonathan Asian Tour 2016 In Guangzhou',
      'stamp' => 1470905310784,
      'venue' => 'Guangdong Performing Arts Center',
      'price' => '￥160-￥580'
    ),
    array(
      'img' => '../_img/pic_03.jpg',
      'name' => 'Joyce Jonathan Asian Tour 2016 In Shanghai',
      'stamp' => 1470905310784,
      'venue' => 'Guangdong Performing Arts Center',
      'price' => '￥160-￥580'
    ),
    array(
      'img' => '../_img/pic_04.jpg',
      'name' => 'Joyce Jonathan Asian Tour 2016 In Shenzhen',
      'stamp' => 1470905310784,
      'venue' => 'Guangdong Performing Arts Center',
      'price' => '￥160-￥580'
    ),
    array(
      'img' => '../_img/pic_05.jpg',
      'name' => 'Joyce Jonathan Asian Tour 2016 In HK',
      'stamp' => 1470905310784,
      'venue' => 'Guangdong Performing Arts Center',
      'price' => '￥160-￥580'
    )
  );

  $ret['status'] = array(
    'code' => 200,
    'message' => 'success'
  );

  $ret['data'] = array_random_assoc($arr, 5);
  
  // 先从 cookie 读取 lang 字段，如果没有则从头 Accept-Language 字段拿语言
  if (isset($_COOKIE['lang'])) {
    $name = $_COOKIE['lang'];
  } else {
    $name = substr($lang, 0, strrpos($lang, ','));
  }
  
  // 语言选择
  switch ($name) {
    case 'zh-CN': $dst = 'zh';
                  break;
    case 'zh-HK': $dst = 'cht';
                  break;
    case 'jp':    $dst = 'jp';
                  break;
    case 'en':    $dst = 'en';
                  break;
    default:      $dst = 'zh';
                  break;
  }
  
  // 调用百度翻译接口
  for ( $i = 1; $i < count( $ret['data'] ); $i++ ) {
    $data = $ret['data'][$i];
    $name = $data['name'];
    $trans = translate($name, 'auto', $dst);
    $trans_result = $trans['trans_result'];
    $one = current($trans_result);
    $tmp = $one['dst'];
    $ret['data'][$i]['name'] = $tmp;
  }

  echo json_encode($ret);
?>