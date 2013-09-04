<?php
  session_start();
  $_SESSION['account_data'] = '';
  $_SESSION['account_type'] = '';
  header("Location: ../login.html"); 


  session_end();
?>
<?php
//Author: Michael Yao
?>
