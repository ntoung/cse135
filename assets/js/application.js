
!function ($) {

  $(function () {

    var $window = $(window)

      // side bar
      setTimeout(function () {
        $('.bs-docs-sidenav').affix({
          offset : {
            top : function () {
              return $window.width() <= 980 ? 290 : 210
            },
            bottom : 140
          }
        })
      }, 100);

    $('body').on('remove', function () {
      $('.affix').each(function () {
        $(this).affix('refresh');
      });
    });

    $('body').on('DOMNodeInsertedIntoDocument', function () {
      $('.affix, .affix-top').each(function () {
        $(this).affix('refresh');
      });
    });

    // make code pretty
    window.prettyPrint && prettyPrint();

    // Make all number inputs only take numbes
    $('input[type="number"]').forceNumeric();

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this),
      method = $this.attr('checked') ? 'addClass' : 'removeClass'
        $(this).parents('.add-on')[method]('active')
    })

    // carousel demo
    $('#myCarousel').carousel()

    // Ryan's Stuff


    // Makes menu on left sortable
    $(".sortable").sortable({
      placeholder : "ui-state-highlight",
      items : "li:not(.not-sortable)",

      //Prevent dragging and clicking conflict
      start : function (event, ui) {
        ui.item.bind("click.prevent",
          function (event) {
          event.preventDefault();
        });
      },

      update : function (event, ui) {
        var i = $('.bs-docs-sidebar > ol > li').index($(ui.item));
        var q = $('#' + $(ui.item).attr('data-linked'));
        renumber();
        $(q).fadeTo("fast", 0.00, function () {
          $(this).slideToggle('slow', function () {
            $(this).detach();
            if (i === 4) {
              $('#questions > div.newQuestion:nth-of-type(' + (i - 3) + ')').before(
                $(this).slideDown(400, function () {
                  $(this).fadeTo(400, 100);
                }));
            } else {
              $('#questions > div.newQuestion:nth-of-type(' + (i - 4) + ')').after(
                $(this).slideDown(400, function () {
                  $(this).fadeTo(400, 100);
                }));

            }
          })
        });
      },
      stop : function (event, ui) {
        setTimeout(function () {
          ui.item.unbind("click.prevent");
        }, 300);
      }
    });
    $(".sortable").disableSelection();

    // Binds click event to delete question
    $('#questions').on("click", 'a[name="deleteQ"]', function (e) {
      e.preventDefault();
      $(this).parents('div.newQuestion').find('input[name="points"]').val(0).trigger('change');
      $(this).parents('div.newQuestion').add($('li[data-linked="' + $(this).parents('div.newQuestion').attr('id') + '"]')).fadeTo('slow', 0.0, function () {
        $(this).slideUp('slow', function () {
          $.when($(this).remove()).then(renumber());
        })
      });
      numQuestions--;
      return false;
    });

    // Binds click event to delete answers
    $('#questions').on("click", 'i.icon-trash', function (e) {
      $(this).closest('div.block', 'div').fadeTo('fast', 0.0, function () {
        $(this).slideUp('fast', function () {
          var parent = $(this).closest('div.newQuestion');
          $.when($(this).remove()).then(function () {
            $(parent).find('input[name="correct"]').each(function (i) {
              $(this).val(i);
            });
          });
        })
      });

    });

    // Binds click event to delete answers
    $('#questions').on("click", 'input[name="addAnswer"]', function (e) {
      var ans;
      var n = $.trim($(this).siblings('input[type="number"]').val());
      var type = $(this).attr('data-type');

      if (isNaN(n)) {
        n = 1;
      }

      if (type == 'mc') {
        ans = $('<div class="input-prepend input-append block"><span class="add-on"><input type="checkbox" value="" name="correct"></span>'
             + '<input type="text" value="" name="answer"><i class="icon-trash btn btn-danger" title="Remove"></i></div>');
      } else if (type == 'fi') {
        ans = $('<div class="input-append block"><input type="text" value="" name="answer" class="input-block"><i class="icon-trash btn btn-danger" title="Remove"></i></div>');
      } else if (type == 'm') {
        ans = $('<div class="block"><input type="text" name="word" placeholder="Word">'
             + '<div class="input-append"><input type="text" name="def" placeholder="Value"><i class="icon-trash btn btn-danger" title="Remove"></i></div></div>');
      } else {
        return false;
      }
      ans.css('display', 'none');

      for (var i = 0; i < n; i++) {
        ansCopy = $(ans).clone();
        $(this).closest('div').before($(ansCopy));
        $(ansCopy).slideDown();
      }

      if (type == 'mc') {
        $(this).closest('div.newQuestion').find('input[name="correct"]').each(function (i) {
          $(this).val(i);
        });
      }

      return true;
    });

    // Binds question name input to sidebar
    $('#questions').on("keyup", 'input[name="questionName"]', function (e) {
      var val = $(this).val();
      var l = $('li[data-linked="' + $(this).closest('div.newQuestion').attr('id') + '"]').find('.anchor');
      var n = $('li[data-linked="' + $(this).closest('div.newQuestion').attr('id') + '"]').find('.anchor > .qNum').text();
      if (val === '')
        val = 'Question';

      $(l).html('<span class="qNum" style-"display: inline;">' + n + '</span>. ' + val);
    });

    $('#possiblePoints').change(function () {
      var val = parseInt($(this).val(), 10);
      if (isNaN(val)) {
        val = 1;
      }

      $('#pointsPossible').text(val);
    });

    $('#questions').on('change', 'input[name="points"]', function () {
      var sum = 0;

      if (isNaN($(this).val())) {
        $(this).val(0);
      }

      $('input[name="points"]').each(function () {
        var val = parseInt($(this).val(), 10);

        if (isNaN(val))
          val = 0;

        sum += val;
      });

      $('#totalPoints').text(sum);
    });

    $('#loadQuiz').click(function () {
      var quizId = $('#loadQuizSelect').val();
      if (quizId.length > 0)
        loadQuiz($('#loadQuizSelect').val());
    })

    $('#quizForm').submit(function (e) {
      e.preventDefault();
      if (saveQuiz()) {
        $('#contents').prepend($('<div class="alert alert-success fade"><button type="button" class="close" data-dismiss="alert">×</button><h4>Quiz saved!</h4><p>Check the console to see the JSON that would be passed to the server.</p></div>').addClass('in'));
        window.setTimeout(function () {
          $(".alert-success ").slideUp(function () {
            $(this).alert('close')
          });
        }, 3000);
      } else {
        $('#contents').prepend($('<div class="alert alert-error fade"><button type="button" class="close" data-dismiss="alert">×</button><h4>Quiz could not be saved! Please try again!</h4></div>').addClass('in'));
        window.setTimeout(function () {
          $(".alert-error ").slideUp(function () {
            $(this).alert('close')
          });
        }, 3000);
      }
      return false;
    });

    $('#amigoSidebar').on('click', 'li:not(.not-sortable)', function () {
      var aTag = $('#' + $(this).closest('li').attr('data-linked'));
      $('html,body').animate({
        scrollTop : aTag.offset().top - 50
      }, 'slow');
    })

    $('#sorter').click(function (e) {
      e.preventDefault();

      $('div.newQuestion').sort(function (a, b) {
        var contentA = parseInt($(a).attr('data-sort'), 10);
        var contentB = parseInt($(b).attr('data-sort'), 10);

        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
      }).fadeOut(400, function () {
        $(this).appendTo('#questions').fadeIn();
      });

      $('.bs-docs-sidebar > ol > li:not(.not-sortable)').sort(function (a, b) {
        var contentA = parseInt($('#' + $(a).attr('data-linked')).attr('data-sort'), 10);
        var contentB = parseInt($('#' + $(b).attr('data-linked')).attr('data-sort'), 10);

        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
      }).fadeOut(400, function () {
        $(this).appendTo('.bs-docs-sidebar > ol ').fadeIn(400, renumber())
      });

      return false;
    });

    $('#addQuestions').change(function () {
      var type = $(this).val();
      var num = $.trim($('#numToAdd').val());

      if (isNaN(num)) {
        num = 1;
      }

      var i = 0;
      for (i = 0; i < num; i++) {
        addQuestion(type);
      }

      $(this).val("");
      $('#numToAdd').val(1);
    });
  })
}

(window.jQuery)

/**
 * JQUERY PLUGIN: I append each jQuery object (in an array of
 * jQuery objects) to the currently selected collection.
 */
jQuery.fn.appendEach = function (arrayOfWrappers) {

  // Map the array of jQuery objects to an array of
  // raw DOM nodes.
  var rawArray = jQuery.map(
      arrayOfWrappers,
      function (value, index) {

      // Return the unwrapped version. This will return
      // the underlying DOM nodes contained within each
      // jQuery value.
      return (value.get());
    });

  // Add the raw DOM array to the current collection.
  this.append(rawArray);

  // Return this reference to maintain method chaining.
  return (this);
};

var numQuestions = 0;

/**
 * Make a question
 */
function addQuestion(type, opts) {
  var q;
  var defaults = {
    questionName : '',
    points : '',
    id : (++numQuestions),
  }
  var opts = $.extend({}, defaults, opts);
  // Question type selector
  switch (type) {
  case 'tf':
    q = buildTrueFalseQuestion(opts);
    sort = 2;
    break;
  case 'mc':
    q = buildMultipleChoiceQuestion(opts);
    sort = 1;
    break;
  case 'sa':
    q = buildShortAnswerQuestion(opts);
    sort = 5;
    break;
  case 'fi':
    q = buildFillInQuestion(opts);
    sort = 4;
    break;
  case 'm':
    q = buildMatchingQuestion(opts);
    sort = 3;
    break;
  default:
    numQuestions--;
    return null;
  }

  /**
   * The following elements are used by all question types
   */
  var d = $('<div></div>').addClass('newQuestion').attr('data-type', type).attr('data-sort', sort).css('display', 'none').attr('id', '' + opts.id + '');

  // Question label
  $(d).append(getBadge(type));
  // Tutorial button
  $(d).append(getHelpButton(type));
  // Delete button
  $(d).append(getDeleteButton());
  // Question Name
  $(d).append(getQuestionName(opts.questionName));

  // The question text itself (not for matching)
  if (type !== 'm') {
    $(d).append(getQuestionElements(opts.questionText));
  }

  // Image uploader
  $(d).append(getFileElement());

  // Build the specific question type
  $(d).appendEach(q);

  // Points box
  $(d).append(getPointBox(opts.points));

  var qName = opts.questionName === '' ? 'Question' : opts.questionName;

  // Sidebar directory of questions
  var l = $('<li data-linked="' + opts.id + '" data-reset="1"><span class="anchor"><span class="qNum">1</span>. ' + qName + '</span></li>').css('display', 'none');
  $.when($('#questions').prepend($(d)), $('.bs-docs-sidebar > ol > li.divider').after($(l))).then(function () {
    $(d).slideDown(400, function () {
      $(d).find('input[name="points"]').trigger('change');
    });
    $(l).slideDown(400, renumber());
  });

  return true;
} // End addQuestion()


/**
 * Build individual question types
 */
function buildTrueFalseQuestion(opts) {
  var elems = new Array();
  var defaults = {
    answer : false
  };
  var opts = $.extend({}, defaults, opts);

  elems.push($('<label>Answers</label>'));
  elems.push($('<label class="radio inline"><input type="radio" value="true" name="answer' + numQuestions + '" ' + ((opts.answer) ? 'checked' : '') + '>True</label>'));
  elems.push($('<label class="radio inline"><input type="radio" value="false" name="answer' + numQuestions + '" ' + ((!opts.answer) ? 'checked' : '') + '>False</label>'
       + '<span class="help-block"><small>Select correct answer</small></span>'));

  return elems;
}

function buildMultipleChoiceQuestion(opts) {
  var elems = new Array();
  var defaults = {
    choose : 'one',
    answer : [],
    choices : ['', '']
  };
  var opts = $.extend({}, defaults, opts);

  elems.push($('<label>Student chooses</label>'));

  elems.push($('<label class="radio inline"><input type="radio" value="one" name="numToChoose1" ' + ((opts.choose === 'multiple') ? '' : 'checked') + '>One Answer</label>'
       + '<label class="radio inline"><input type="radio" value="multiple" name="numToChoose1" ' + ((opts.choose === 'multiple') ? 'checked' : '') + '>Multiple answers</label>'
       + '<label>Possible Answers</label>'
       + '<span class="help-block"><small>Check correct answer(s)</small></span>'));

  $(opts.choices).each(function (i) {
    elems.push($('<div class="input-prepend input-append block"><span class="add-on"><input type="checkbox" value="' + i + '" name="correct" ' + ((opts.answer.indexOf(i) > -1) ? 'checked' : '') + '></span>'
         + '<input type="text" value="' + this + '" name="answer"><i class="icon-trash btn btn-danger" title="Remove"></i></div>'));
  });

  elems.push($('<div class="input-append"><input type="number" value="1" name="addAnswers" class="input-mini" min="1">'
       + '<input type="button" class="btn btn-info" value="Add Answer(s)" name="addAnswer" data-type="mc"></div>'));

  return elems;
}

function buildMatchingQuestion(opts) {
  var elems = new Array();

  var defaults = {
    answer : [{
        word : '',
        def : ''
      }, {
        word : '',
        def : ''
      }
    ]
  };
  var opts = $.extend({}, defaults, opts);

  elems.push($('<label>Word-Value Pairs </label>'));

  $(opts.answer).each(function (i, o) {
    elems.push($('<div class="block"><input type="text" name="word" value="' + o.word + '" placeholder="Word">'
         + '<div class="input-append"><input type="text" value="' + o.def + '" name="def" placeholder="Value"><i class="icon-trash btn btn-danger" title="Remove"></i></div></div>'));
  });

  elems.push($('<div class="input-append"><input type="number" value="1" name="addAnswers" class="input-mini" min="1"><input type="button" class="btn btn-info" value="Add Pair(s)" name="addAnswer" data-type="m"></div>'));

  return elems;
}

function buildFillInQuestion(opts) {
  var elems = new Array();

  var defaults = {
    answer : ['']
  };
  var opts = $.extend({}, defaults, opts);

  elems.push($('<label>Acceptable Answers</label>'));

  $(opts.answer).each(function (i) {
    elems.push($('<div class="input-append block"><input type="text" value="' + this + '" name="answer" class="input-block"><i class="icon-trash btn btn-danger" title="Remove"></i></div>'));
  });
  elems.push($('<div class="input-append"><input type="number" value="1" name="addAnswers" class="input-mini" min="1">'
       + '<input type="button" class="btn btn-info" value="Add Answer(s)" name="addAnswer" data-type="fi"></div>'));

  return elems;
}

function buildShortAnswerQuestion() {
  return new Array();
}

/**
 * Generic question elements
 */

// Question Label
function getBadge(type) {
  var badge = "";

  switch (type) {
  case 'tf':
    badge = 'True/False';
    break;
  case 'mc':
    badge = 'Multiple Choice';
    break;
  case 'sa':
    badge = 'Short Answer';
    break;
  case 'fi':
    badge = 'Fill-in';
    break;
  case 'm':
    badge = 'Matching';
    break;
  default:
    break;
  }

  return $('<span class="badge badge-info">' + badge + '</span>');
}

// Trash button
function getDeleteButton() {
  return $('<a class="icon-trash close" href="#" style="color: red" name="deleteQ" title="Remove"></a>');
}

// Question Name
function getQuestionName(name) {
  return $('<input type="text" name="questionName" value="' + (name || '') + '" placeholder="Question Label">');
}

// Question text
function getQuestionElements(text) {
  return [$('<label>Question</label>'), $('<div class="textarea input-xxlarge" contenteditable="">' + (text || '') + '</div>'), $('<span class="help-block">Type question in box above. Use underscores to indicate a "blank", if applicable.</span>')];
}

// Image upload
function getFileElement() {
  return $('<label>Optional Graphic</label><div class="fileupload fileupload-new" data-provides="fileupload">'
     + '<div class="fileupload-new thumbnail" style="width: 50px; height: 50px;"><img src="http://www.placehold.it/50x50/AAAAAA/FFFFFF&text=+" /></div>'
     + '<div class="fileupload-preview fileupload-exists thumbnail" style="width: 50px; height: 50px;"></div>'
     + '<span class="btn btn-file"><span class="fileupload-new">Select image</span><span class="fileupload-exists">Change</span><input type="file" /></span>'
     + '<a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a></div>');
}

// Tour button
function getHelpButton(type) {
  var helpTypeLabel;

  switch (type) {
  case 'tf':
    helpTypeLabel = 'True/False';
    break;
  case 'mc':
    helpTypeLabel = 'Multiple Choice';
    break;
  case 'sa':
    helpTypeLabel = 'Short Answer';
    break;
  case 'fi':
    helpTypeLabel = 'Fill-in';
    break;
  case 'm':
    helpTypeLabel = 'Matching';
    break;
  default:
    break;
  }
  return $('<span class="pull-right"><div name="help' + type + 'Button"><button class="btn btn-warning" title="' + helpTypeLabel + ' Help" onclick="tutorial' + type + '();"><i class="icon-question-sign"></i> ' + helpTypeLabel + ' Help</button></div></span>');
}

/**
 * Point tracking functionality
 */
function getPointBox(points) {
  return $('<label>Points</label><div name="PointBox"><input type="number" name="points" min="0" class="input-mini pointsBox" value="' + (points || '1') + '"></div>');
}

var curPoint = 0;

function changePoint(curPointBox) {
  var totalPointsBox = document.getElementById("totalPoints");
  var totalPoints = totalPointsBox.textContent;
  totalPointsBox.textContent = totalPoints - curPoint + parseInt(curPointBox.value, 10);
}

function setCurPoint(curPointBox) {
  curPoint = parseInt(curPointBox.value, 10);
}

/**
 * Sorting functionality
 */
function renumber() {
  $('.bs-docs-sidebar > ol > li').each(function () {
    var i = $('.bs-docs-sidebar > ol > li').index($(this)) - 3;
    $(this).find('span.qNum').fadeOut('fast', function () {
      $(this).text(i).fadeIn('fast');
    })
  });
}

function serializeQuiz() {
  var questions = $('div.newQuestion');
  var settings = $('#quizSettings :input:not(button):not(#loadQuiz)');

  var quiz = {
    id : guid(),
    questions : [],
    settings : {}
  };

  $(settings).each(function () {
    quiz['settings'][$(this).attr('name')] = $(this).val();
  });

  $(questions).each(function () {
    quiz.questions.push(serializeQuestion($(this)));
  });

  quiz = JSON.stringify(quiz, null, '\t');
  console.log(quiz);
  document.getElementById('json_string').value = quiz;  
  return quiz;
}

function serializeQuestion(q) {

  var type = $(q).attr('data-type');
  var serialized;
  // Question type selector
  switch (type) {
  case 'tf':
    serialized = serializeTrueFalseQuestion(q);
    break;
  case 'mc':
    serialized = serializeMultipleChoiceQuestion(q);
    break;
  case 'sa':
    serialized = serializeShortAnswerQuestion(q);
    break;
  case 'fi':
    serialized = serializeFillInQuestion(q);
    break;
  case 'm':
    serialized = serializeMatchingQuestion(q);
    break;
  default:
    return null;
  }

  return serialized;
}

function serializeTrueFalseQuestion(q) {
  var serialized = {};

  serialized['id'] = $(q).attr('id');
  serialized['type'] = $(q).attr('data-type');
  serialized['name'] = $(q).find('input[name="questionName"]').val();
  serialized['questionText'] = $(q).find('.textarea').text();
  serialized['answer'] = ($(q).find('input[type="radio"]:checked').val() == "true");
  serialized['points'] = $(q).find('input[name="points"]').val();

  return serialized;
}

function serializeMultipleChoiceQuestion(q) {
  var serialized = {};

  serialized['id'] = $(q).attr('id');
  serialized['type'] = $(q).attr('data-type');
  serialized['name'] = $(q).find('input[name="questionName"]').val();
  serialized['questionText'] = $(q).find('.textarea').text();
  serialized['choose'] = $(q).find('input[type="radio"]:checked').val();
  serialized['choices'] = $(q).find('input[name="answer"]').map(function () {
      return $(this).val();
    }).get();
  serialized['answer'] = $(q).find('input[name="correct"]:checked').map(function () {
      return $(this).val();
    }).get();
  serialized['points'] = $(q).find('input[name="points"]').val();

  return serialized;
}

function serializeMatchingQuestion(q) {
  var serialized = {};

  serialized['id'] = $(q).attr('id');
  serialized['type'] = $(q).attr('data-type');
  serialized['name'] = $(q).find('input[name="questionName"]').val();
  serialized['answer'] = $(q).find('input[name="word"]').map(function (i, o) {
      return [{
          word : $(this).val(),
          def : $(q).find('input[name="def"]').eq(i).val()
        }
      ];
    }).get();
  serialized['points'] = $(q).find('input[name="points"]').val();

  return serialized;
}

function serializeFillInQuestion(q) {
  var serialized = {};

  serialized['id'] = $(q).attr('id');
  serialized['type'] = $(q).attr('data-type');
  serialized['name'] = $(q).find('input[name="questionName"]').val();
  serialized['questionText'] = $(q).find('.textarea').text();
  serialized['answer'] = $(q).find('input[name="answer"]').map(function () {
      return $(this).val();
    }).get();
  serialized['points'] = $(q).find('input[name="points"]').val();

  return serialized;
}

function serializeShortAnswerQuestion(q) {
  var serialized = {};
  serialized['id'] = $(q).attr('id');
  serialized['type'] = $(q).attr('data-type');
  serialized['name'] = $(q).find('input[name="questionName"]').val();
  serialized['questionText'] = $(q).find('.textarea').text();
  serialized['points'] = $(q).find('input[name="points"]').val();

  return serialized;
}

/**
 * Joyride tours
 */

/* Basic Tutorial */
function tutorialBase() {
  $('#tour').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
}

/* Settings Tutorial */
function tutorialsettings() {
  $('#toursettings').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
}

function tutorialtf() {
  $('#tf').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
}
function tutorialmc() {
  $('#mc').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
}
function tutorialsa() {
  $('#sa').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
}
function tutorialfi() {
  $('#fi').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
}
function tutorialm() {
  $('#m').joyride({
    postRideCallback : function () {
      $('.first-joyride-tips').joyride('destroy');
    },

    autoStart : true,
  });
} // End joyride tours

/**
 * Planned serverside functionality
 */
function saveQuiz() {
  var quizData = serializeQuiz();

  $.mockjax({
    url : 'saveQuiz.php',
    responseText : '{"success": true}'
  });
  var posting = $.post('saveQuiz.php', quizData, function (data) {
      success = data.success;
    }, 'json');

  return true;
}

function loadQuiz(quizId) {
  $.mockjax({
    url : 'loadQuiz.php',
    proxy : 'assets/mocks/' + quizId + '.json',
    dataType : 'json' /* ,
    response: function() {
    switch (quizId){
    case 'bedbd548-07f7-2077-9ddd-811961cf864b':
    this.responseText = '{"id":"bedbd548-07f7-2077-9ddd-811961cf864b","questions":[{"id":"5","type":"tf","name":"Sky","questionText":"The sun is a star.","answer":true,"points":"1"},{"id":"4","type":"sa","name":"Hobby","questionText":"What is your hobby?","points":"1"},{"id":"3","type":"sa","name":"Favorite Author","questionText":"Who is your favorite author?","points":"1"},{"id":"2","type":"sa","name":"Name","questionText":"What is your name?","points":"1"},{"id":"1","type":"mc","name":"Favorite Color","questionText":"What is your favorite color?","choose":"one","choices":["Red","Green","Blue","Yellow","Purple","Other"],"answer":[],"points":"1"}],"settings":{"quizName":"Personal Quiz","timeLimit":"","possiblePoints":"5","viewAnswers":"1","startDate":"2013-08-01","startTime":"00:00","endDate":"2013-08-31","endTime":"23:59","randomizeTaker":"1"}}'
    break;
    }
    }*/
  });

  $.getJSON("loadQuiz.php", {
    id : quizId
  }, function (quizData) {

    $.each(quizData.settings, function (key, val) {
      $('#quizSettings :input[name="' + key + '"]').val(val).change();
    });

    $.each(quizData.questions, function (key, question) {
      addQuestion(question.type, question);
    });
  });
}

function clearPage() {
  numQuestions = 0;
  $('#questions').html('');
  $('#quizForm')[0].reset();
  $('li[data-reset="1"]').remove();
  $('#pointsPossible').text('1');
  $('#totalPoints').text('0');
}

// forceNumeric() plug-in implementation
jQuery.fn.forceNumeric = function () {

  return this.each(function () {
    $(this).keydown(function (e) {
      var key = e.which || e.keyCode;

      if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
        // numbers
        key >= 48 && key <= 57 ||
        // Numeric keypad
        key >= 96 && key <= 105 ||
        // comma, period and minus, . on keypad
        key == 190 || key == 188 || key == 109 || key == 110 ||
        // Backspace and Tab and Enter
        key == 8 || key == 9 || key == 13 ||
        // Home and End
        key == 35 || key == 36 ||
        // left and right arrows
        key == 37 || key == 39 ||
        // Del and Ins
        key == 46 || key == 45)
        return true;

      return false;
    });
  });
}

// Used for generating Quiz IDs
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);
};

// Used for generating Quiz IDs
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}

/**
 * Creates preview page of what the quiz will look like
 */
function preview() {
  // Open new window
  var new_win = window.open();
  var quizData = JSON.parse(serializeQuiz());
  // Create html document with style and nav bar
  new_win.document.writeln('<!DOCTYPE html>');
  new_win.document.writeln('<html lang="en">');
  new_win.document.writeln('<head>');
  new_win.document.writeln('<meta charset="utf-8">');
  new_win.document.writeln('<title>QuizMaker Preview</title>');
  new_win.document.writeln('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  new_win.document.writeln('<meta name="description" content="">');
  new_win.document.writeln('<meta name="author" content="">');
  new_win.document.writeln('<link href="assets/css/bootstrap.css" rel="stylesheet">');
  new_win.document.writeln('<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">');
  new_win.document.writeln('<link href="assets/css/docs.css" rel="stylesheet">');
  new_win.document.writeln('<link href="assets/js/google-code-prettify/prettify.css" rel="stylesheet">');
  new_win.document.writeln('<link href="assets/css/custom-theme/jquery-ui-1.10.0.custom.css" rel="stylesheet">');
  new_win.document.writeln('<link rel="shortcut icon" href="assets/ico/favicon.ico">');
  new_win.document.writeln('<link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">');
  new_win.document.writeln('<link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">');
  new_win.document.writeln('<link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">');
  new_win.document.writeln('<link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">');
  new_win.document.writeln('<style type="text/css"></style></head>');
  new_win.document.writeln('<body data-spy="scroll" data-target=".bs-docs-sidebar">');
  new_win.document.writeln('<div class="navbar navbar-inverse navbar-fixed-top">');
  new_win.document.writeln('<div class="navbar-inner">');
  new_win.document.writeln('<div class="container">');
  new_win.document.writeln('<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">');
  new_win.document.writeln('<span class="icon-bar"></span>');
  new_win.document.writeln('<span class="icon-bar"></span>');
  new_win.document.writeln('<span class="icon-bar"></span>');
  new_win.document.writeln('</button>');
  new_win.document.writeln('<a class="brand" href="./index.html">four amigos QuizMaker</a>');
  new_win.document.writeln('<div class="nav-collapse collapse">');
  new_win.document.writeln('<ul class="nav">');
  new_win.document.writeln('<li class="">');
  new_win.document.writeln('<a href="./index.html">Home</a>');
  new_win.document.writeln('</li>');
  new_win.document.writeln('<li class="active">');
  new_win.document.writeln('<a href="./quizMaker.html">Make a Quiz</a>');
  new_win.document.writeln('</li>');
  new_win.document.writeln('</ul>');
  new_win.document.writeln('</div>');
  new_win.document.writeln('</div>');
  new_win.document.writeln('</div>');
  new_win.document.writeln('</div>');

  // Displays Header (includes quiz name, time limit, points possible, start and end times)
  new_win.document.writeln('<header class="jumbotron subhead" id="overview">');
  new_win.document.writeln('<div class="container"><form>');
  new_win.document.writeln('<fieldset>');
  new_win.document.writeln('<legend>' + $('#quizName').val() + '</legend>');
  new_win.document.writeln('<div class="inline-block span3">' + 'Time Limit: ' + $(timeLimit).val() + ' minute(s)' + '</div>');
  new_win.document.writeln('<div class="inline-block offset1">Possible Point(s): ' + $(possiblePoints).val() + '</div><br>');
  new_win.document.writeln('<div class="inline-block span3">Start Date: ' + $(startDate).val() + '</div>');
  new_win.document.writeln('<div class="inline-block offset1">Start Time: ' + $(startTime).val() + '</div><br>');
  new_win.document.writeln('<div class="inline-block span3">End Date: ' + $(endDate).val() + '</div>');
  new_win.document.writeln('<div class="inline-block offset1">End Time: ' + $(endTime).val() + '</div>');
  new_win.document.writeln('</fieldset></form></div></header>');

  // Displays Questions and Answers
  new_win.document.writeln('<div class="container-fluid">');
  new_win.document.writeln('<div class="row-fluid">');
  new_win.document.writeln('<div class="span2">');
  new_win.document.writeln('</div>');
  new_win.document.writeln('<div class="span8">');
  new_win.document.writeln('<form>');
  new_win.document.writeln('<fieldset>');

  // Loop and print all the questions in the quiz
  $.each($(quizData.questions), function (i, q) {
    console.log(q);
    new_win.document.writeln(previewQuestion(q));
  });

  new_win.document.writeln('</fieldset>');
  new_win.document.writeln('</form></div></div></div>');

  // Bottom Buttons for save, submit and start over
  new_win.document.writeln('<div class="container">');
  new_win.document.writeln('<section id="contents">');
  new_win.document.writeln('<div class="form-actions"><span class="pull-right">');
  new_win.document.writeln('<input type="submit" value="Save Quiz" class="btn btn-success">');
  new_win.document.writeln('<input type="button" value="Submit" class="btn">');
  new_win.document.writeln('<input type="reset" value="Start Over" class="btn btn-danger">');
  new_win.document.writeln('</span></div>');
  new_win.document.writeln('</section>');
  new_win.document.writeln('</div>');

  // Footer
  new_win.document.writeln('<footer class="footer">');
  new_win.document.writeln('<div class="container">');
  new_win.document.writeln('<p class="pull-right"><a href="#">Back to top</a></p>');
  new_win.document.writeln('<p>&copy; 2013 <a href="team_page.html">four amigos</a></p>');
  new_win.document.writeln('</div>');
  new_win.document.writeln('</footer>');

  // Javascript includes
  new_win.document.writeln('<script src="assets/js/jquery.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/google-code-prettify/prettify.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-transition.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-alert.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-modal.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-dropdown.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-scrollspy.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-tab.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-tooltip.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-popover.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-button.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-collapse.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-carousel.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-typeahead.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/bootstrap-affix.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/jasny-bootstrap.min.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/application.js"><\/script>');
  new_win.document.writeln('<script src="assets/js/jquery-ui-1.10.3.custom.js"><\/script>');
  new_win.document.writeln('</body>');
  new_win.document.writeln('</html>');
} // End preview

function previewQuestion(q) {
  var type = q.type;
  var preview;
  switch (type) {
  case 'tf':
    preview = previewTrueFalseQuestion(q);
    break;
  case 'mc':
    preview = previewMultipleChoiceQuestion(q);
    break;
  case 'sa':
    preview = previewShortAnswerQuestion(q);
    break;
  case 'fi':
    preview = previewFillInQuestion(q);
    break;
  case 'm':
    preview = previewMatchingQuestion(q);
    break;
  default:
    return null;
  }

  return preview;
}

function previewTrueFalseQuestion(q) {

  // prop.('outerHTML') returns the $() object as a string
  // $('<div class="qtitle">'+name+'</div>').prop('outerHTML') gives  '<div class="qtitle">Question 1</div>';

  // elems.join('') joins all the string elements of the elems array into one big string.
  // then in the preview function, we write the resulting string to the new window

  console.log(q);
  var elems = new Array();
  var name = q.name || '';
  elems.push($('<div class="qtitle">' + name + '</div>').prop('outerHTML'));
  elems.push($('<div class="well well-small">' + q.questionText
       + '<label class="radio">'
       + '<input type="radio" name="optionsRadios1" id="optionsRadiosQ1T" value="true">'
       + 'True</label>'
       + '<label class="radio">'
       + '<input type="radio" name="optionsRadios1" id="optionsRadiosQ1F" value="false">'
       + 'False</label>').prop('outerHTML'));
  return elems.join('');
}

function previewMultipleChoiceQuestion(q) {

  // prop.('outerHTML') returns the $() object as a string
  // $('<div class="qtitle">'+name+'</div>').prop('outerHTML') gives  '<div class="qtitle">Question 1</div>';

  // elems.join('') joins all the string elements of the elems array into one big string.
  // then in the preview function, we write the resulting string to the new window

  console.log(q);
  var elems = new Array();
  var name = q.name || '';
  elems.push($('<div class="qtitle">' + name + '</div>').prop('outerHTML'));
  elems.push($('<div class="well well-small">' + q.questionText
       + '<label class="radio">'));
  elems.push($(q.choices.each('<input type="radio" name="optionsRadios1">' + q.choices)
       + '').prop('outerHTML'));
  return elems.join('');
}

function previewShortAnswerQuestion(q) {

  // prop.('outerHTML') returns the $() object as a string
  // $('<div class="qtitle">'+name+'</div>').prop('outerHTML') gives  '<div class="qtitle">Question 1</div>';

  // elems.join('') joins all the string elements of the elems array into one big string.
  // then in the preview function, we write the resulting string to the new window

  console.log(q);
  var elems = new Array();
  var name = q.name || '';
  elems.push($('<div class="qtitle">' + name + '</div>').prop('outerHTML'));
  elems.push($('<div class="well well-small">' + q.questionText
       + '<div class="textarea input-xxlarge" contenteditable></div>').prop('outerHTML'));
  return elems.join('');
}

function previewFillInQuestion(q) {

  // prop.('outerHTML') returns the $() object as a string
  // $('<div class="qtitle">'+name+'</div>').prop('outerHTML') gives  '<div class="qtitle">Question 1</div>';

  // elems.join('') joins all the string elements of the elems array into one big string.
  // then in the preview function, we write the resulting string to the new window

  console.log(q);
  var elems = new Array();
  var name = q.name || '';
  elems.push($('<div class="qtitle">' + name + '</div>').prop('outerHTML'));
  elems.push($('<div class="well well-small">' + q.questionText
       + '<div class="textarea input-xxlarge" contenteditable></div>').prop('outerHTML'));
  return elems.join('');
}

function previewMatchingQuestion(q) {

  // prop.('outerHTML') returns the $() object as a string
  // $('<div class="qtitle">'+name+'</div>').prop('outerHTML') gives  '<div class="qtitle">Question 1</div>';

  // elems.join('') joins all the string elements of the elems array into one big string.
  // then in the preview function, we write the resulting string to the new window

  console.log(q);
  var elems = new Array();
  var name = q.name || '';
  elems.push($('<div class="qtitle">' + name + '</div>').prop('outerHTML'));
  elems.push($('<div class="well well-small">' + q.questionText
       + '<label class="radio">'
       + '<input type="radio" name="optionsRadios1" id="optionsRadiosQ1T" value="true">'
       + 'True</label>'
       + '<label class="radio">'
       + '<input type="radio" name="optionsRadios1" id="optionsRadiosQ1F" value="false">'
       + 'False</label>').prop('outerHTML'));
  return elems.join('');
}
