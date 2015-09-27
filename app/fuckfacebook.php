<?php
require_once 'Facebook/autoload.php';

$appId = '1634953146778968';
$secret = '9aa610301779bf45c2050d7d6d3ce24a';
$returnurl = 'http://192.185.67.199/~arielces/ac-generador-noticias/';
$permissions = 'manage_pages';
$page_id = "1568521816767164";
//$page_access_token = "CAAXOZBzGJxVgBADgrbyy0SbPB3HzRkOyYkziyfnalLUGjxq72q8KUNcTvEl21c07bPWGd7BxyI7xPiD3unxUUAaTPnYKKZBCr27aC9c8i9FEODDGxYY5ZA69c5tU3P5JVbUgQkb2F1w4K4ZCX5sZBUYO2QyKXpk8bfD8trLl6ZAm8z7Wo4uexYmYRoF8cXw9QIh30JvCImJwZDZD";
$page_access_token = "1634953146778968|ce5mxHmTk1Jsh1s_2A_YdvLbH1Y";


//$fb = new Facebook(array('appId'=>$appId, 'secret'=>$secret));
$fb = new Facebook\Facebook([
    'app_id' => $appId,
    'app_secret' => $secret,
    'default_graph_version' => 'v2.4',
]);
//$fb = new Facebook\FacebookApp(
//    $appId,
//    $secret
//);


$params =  array(
    'access_token'  => $page_access_token,
    'name'          => 'hola',
    'link'          => 'acdesarrollos.com',
    'description'   => 'Estos es una prueba de prublicación automática',
    'message'       => 'acdesarrollos.com',
    'caption'       => 'Prueba',
    'picture'       => '',
    'published'     => true
);

//$post = (new \Facebook\FacebookRequest($fb, 'POST', '/'.$page_id.'/feed', $params))->execute()->getGraphObject()->asArray();
//$post = new Facebook\FacebookRequest($fb, $page_access_token, 'GET', '/acdesarrollos?fields=feed');
//
//echo print_r($post);

//$responce = $fb->get("/acdesarrollos/feed", $page_access_token);
$responce = $fb->post("/acdesarrollos/feed", $params, $page_access_token);
echo print_r($responce);

//$fbuser = $fb->getUser();

if (true) {
//if($fbuser){

    //$page_access_token = "1617691071796143|d84420ccfe2fa7eecac50ca96936bb21";
//    $result =  $fb->api("/me/accounts");
//    $helper = $fb->getPageTabHelper();
//    $result = $fb->api('/' . $page_id . '/feed', 'POST', $message);


//    echo print_r($helper->api("/me/feed"));

//    $fb->api('/' . $page_id . '/feed', 'post', array(
//        'message' => "It's awesome ...",
//        'link' => 'http://ac-desarrollos.com',
//        'picture' => 'http://csslight.com/application/upload/WebsitePhoto/567-grafmiville.png',
//        'name' => 'Featured of the Day',
//        'from' => 'ac-desarrollos',
//        'description' => 'CSS Light is a showcase for web design encouragement, submitted by web designers of all over the world. We simply accept the websites with high quality and professional touch.'
//    ));


    // loop trough all your pages and find the right one
//    if( !empty($result['data']) )
//    {
//        foreach($result["data"] as $page)
//        {
//            if($page["id"] == $page_id)
//            {
//                $page_access_token = $page["access_token"];
//                break;
//            }
//        }
//    }
//    else
//    {
//        echo "AN ERROR OCCURED: could not get the access_token. Please verify the page ID ".$page_id." exists.";
//    }

//    $fb->setAccessToken($page_access_token);
//
//    // Now try to post on page's wall
//    try{
//        $message = array(
//            'message' => "YOUR MESSAGE",
//
//        );
//
//        $result = $fb->api('/'.$page_id.'/feed','POST',$message);
//        if($result){
//            echo 'Successfully posted to Facebook Wall...';
//        }
//    }catch(FacebookApiException $e){
//        echo $e->getMessage();
//    }

} else {

    $fbloginurl = $fb->getLoginUrl(array('redirect-uri' => $returnurl, 'scope' => $permissions));
    echo '<a href="' . $fbloginurl . '">Login with Facebook</a>';

}
?>