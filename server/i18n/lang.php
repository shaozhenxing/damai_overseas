<?php
  // header('Access-Control-Allow-Origin' . getallheaders()['Referer']);
  
  // 版本号
  $version = file_get_contents('./version');

  // 语言文件缓存
  $cache_locals = Array();

  $cache_locals = getdirfills('locals/', '.json');
  
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
  
  // 先从 cookie 读取 lang 字段，如果没有则从头 Accept-Language 字段拿语言
  if (isset($_COOKIE['lang'])) {
    $name = $_COOKIE['lang'];
  } else {
    $name = substr($lang, 0, strrpos($lang, ','));
  }
  
  // 响应体
  $response = Array();

  $response['lang'] = $name;
  $response['version'] = $version;

  
  // 如果支持 localstorage 且版本号不一致则返回所有文件，否则返回版本号

  // 解析 Request Payload
  $post_data = file_get_contents('php://input');

  $post_data = json_decode($post_data);
  
  // 支持本地存储
  if ( $post_data -> localstorage ) {
    // 版本号不一致返回所有文件
    if ( !isset($post_data -> version) || ($post_data -> version !== $version) ) {
      $response['locals'] = $cache_locals;
    }
  } else {
    $response['locals'] = Array(
      $name => $cache_locals[$name]
    );
  }

  echo json_encode($response);
  
  // 获取目录下文件内容
  function getdirfills( $path, $replace ) {
    $filesnames = scandir( $path );
    $result = Array();

    foreach ($filesnames as $filename) {
      $filepath = $path . $filename;

      if ( is_file($filepath) ) {
        $filepath = str_replace('\\','/', $filepath);

        $file_string = file_get_contents( $filepath );
        $file_object = json_decode( $file_string );

        $filename = str_ireplace($replace, '', $filename);

        $result[ $filename ] = $file_object;
      }
    }

    return $result;
  }
?>