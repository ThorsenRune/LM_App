<?PHP		
/*	File: data.php
		get a setupfile (data.txt)
	invoked by interface.js:mPHPCall

*/
//ini_set('display_errors', 1);			
//ini_set('display_startup_errors', 1);
header("Access-Control-Allow-Origin: *");		//190626 Enabling CORS
//error_reporting(E_ALL| E_STRICT); 		//Stop on all errors for debugging
class prog{	
	public static function mMain()
	{		
		$s=prog::mGetData();
		$cmd=$s->cmd??"load";		//Default action usin  nullish coalescing 
		if (isset($s->data->sFileName)) prog::$DATABASE=$s->data->sFileName;
		if($cmd=='save'){
			$s->cmd='saved';
			prog::data_save($s->data);
		} else if($cmd=='load'){
			if(file_exists(prog::mFileName()) ){
				$s->cmd='loaded';
				$s->data=prog::data_load();
			} else {
				$s->err="Server file missing: .../".prog::mFileName();
			}
		} else if($cmd=='swap'){		//Get previous file data and write new
			$old=prog::data_load();
			prog::data_save($s->data);
			$s->cmd='old';
			$s->data=$old;
		}
		die(json_encode($s));		//Return data to javascript
	}
	public static function mGetData(){
		//var_dump($_POST);die;
		if (!isset($_POST['data'])) return new stdClass();
		$d=$_POST['data'];			//Get data
		$d=json_decode($d);
		return $d;
	}
	public static function mFileName(){
		return prog::$datdir.prog::$DATABASE;
		
	}
	public static $datdir ='./data/';
	public static $DATABASE=  'data.txt';
	public static function data_load()	{		//Loads current protocol object with data  
		return file_exists(prog::mFileName()) ? json_decode(file_get_contents(prog::mFileName())) : false;
	}
	public static function data_save($db)
	{
		file_put_contents(prog::mFileName(), json_encode($db, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
		//But we dont want to force objects which will corrupt  arrays
		//file_put_contents(prog::mFileName(), json_encode($db, JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
	}
}
prog::mMain();
?>