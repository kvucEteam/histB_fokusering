var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;
var TagArray = [];
var NumOfUniqueTags;

// MARK 4


function elementInArray(tArray, element){
    for (x in tArray){
        if (tArray[x] == element) return true 
    }
    return false;
}
console.log("elementInArray - true: " + elementInArray([1,2,3,4,5], 3));
console.log("elementInArray - false: " + elementInArray([1,2,3,4,5], 6));


// OK
function ReturnAjaxData(Type, Url, Async, DataType) {
    $.ajax({
        type: Type,
        url: Url,
        async: Async,
        dataType: DataType,
        success: function(Data) {
            console.log("ReturnAjaxData: " + JSON.stringify(Data));
            jsonData = JSON.parse(JSON.stringify(Data));
            // JsonExternalData = JSON.parse(JSON.stringify(Data));
            // console.log("HowWhyData: " + HowWhyData); 
        }
    }).fail(function() {
        alert("Ajax failed to fetch data - the requested quizdata might not exist...");
    });
}

// OK
function ReturnURLPerameters(UlrVarObj){
    var UrlVarStr = window.location.search.substring(1);
    console.log("ReturnURLPerameters - UrlVarStr: " + UrlVarStr);
    var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&");  // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
    console.log("ReturnURLPerameters - UrlVarPairArray: " + UrlVarPairArray);
    for (var i in UrlVarPairArray){
        var UrlVarSubPairArray = UrlVarPairArray[i].split("=");  // & = %3D
        if (UrlVarSubPairArray.length == 2){
            UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
        }
    }
    console.log("ReturnURLPerameters - UlrVarObj: " + JSON.stringify( UlrVarObj ));
    return UlrVarObj;
}


// OK
// Controles til width of the UserMsgBox
function UserMsgBox_SetWidth(TargetSelector, WidthPercent){
    var Width = $(TargetSelector).width();
    $("#UserMsgBox").width(WidthPercent*Width);
}


// ================================================================================================
//      Fokusering - new code
// ================================================================================================


function hastagStrToArray(hastagStr){
    // jsonData[n].userInterface.btnHastagStr.split(",")
    var btnArray = hastagStr.split(",");
    console.log("hastagStrToArray - btnArray: " + btnArray);
    for (n in btnArray){
        btnArray[n] = btnArray[n].trim().replace("#","");
    }
    return btnArray;
}
console.log("hastagStrToArray: " + hastagStrToArray("#Ungdomsoprør, #Kvindebevægelsen, #Rødstrømper, #Kønsroller, #Individ, #Familie"));
console.log("hastagStrToArray: " + JSON.stringify( hastagStrToArray("#Tag1 a b, #Tag2 a b, #Tag3 a b") ) );


// OK
function GetAllUniqueTags(jsonData){
    var TagArray = [];
    var TagArrayWrong = [];
    for (n in jsonData){
        TagArray = TagArray.concat(jsonData[n].userInterface.btn);  // Add all correct answers
        if (jsonData[n].userInterface.hasOwnProperty("btnWrong"))
            TagArrayWrong = TagArrayWrong.concat(jsonData[n].userInterface.btnWrong);
    }
    console.log("GetAllUniqueTags - TagArray 1: " + TagArray);

    TagArray = TagArray.filter( onlyUnique );
    NumOfUniqueTags = TagArray.length;
    console.log("GetAllUniqueTags - NumOfUniqueTags: " + NumOfUniqueTags);

    TagArrayWrong = TagArrayWrong.filter( onlyUnique );

    TagArray = TagArray.concat(TagArrayWrong);

    console.log("GetAllUniqueTags - TagArray 2: " + TagArray);

    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    return TagArray;
}

// OK
function returnSourcePages(jsonData){
    var HTML = '';
    for (n in jsonData) {
        HTML += '<div class="SourcePage">';
        
        HTML +=     '<div class="Source">'+returnSourcelItem(n, jsonData)+'</div>';

        HTML +=     '<div '+'id="btnContainer_'+n+'" class="BtnContainer">';
        var btnArray = jsonData[n].userInterface.btn;
        // for (m in btnArray){
        for (m in TagArray){
            // HTML += '<span class="btn btn-default StudentAnswer">'+btnArray[m]+'</span>';
            HTML += '<span class="btn btn-default StudentAnswer">'+TagArray[m]+'</span>';
        }
            HTML += '</div>';
        HTML += '</div>';
    }
    return HTML;
}


// OK
function returnSourcelItem(questionNum, jsonData){
    var itemData = jsonData[questionNum].quizData;
    var HTML = '';
    switch(itemData.kildeData.type) {
        case "img":
            // HTML += '<div class="SourceWrapper" data-toggle="modal" data-target="#myModal"> <img class="img-responsive SourceImg" src="'+itemData.kildeData.src+'" alt="'+itemData.kildeData.alt+'"/> </div>';
            HTML += '<div class="SourceWrapper" data-toggle="modal" data-target="#myModal"> <img class="img-responsive SourceImg" src="'+itemData.kildeData.src+'" alt="'+itemData.kildeData.alt+'"/> </div>';
            break;
        case "text":
            HTML += '<div class="TextHolder SourceWrapper">'+itemData.kildeData.text+'</div>';
            break;
        case "video":
            HTML += '<div class="SourceWrapper embed-responsive embed-responsive-16by9 col-xs-12 col-md-12">' + 
                        '<iframe class="embed-responsive-item" src="'+itemData.kildeData.src+'?rel=0" allowfullscreen="1"></iframe>' + 
                    '</div>';
            break;
        default:
            alert('Invalid "type"');
    }
    console.log("returnSourcelItem: " + HTML);
    return HTML;
}


// OK
function ScaleProcessBarUnderImagesInMobileView(){
    $(".SourceImg").each(function( index, element ) {
        // var ParentObj = $(element).parent();
        var ParentObj = $(element).closest(".LeftContent");
        var Width = $(element).width();
        console.log("ScaleProcessBarUnderImagesInMobileView - Width: " + Width);
        $(".ProcessBar", ParentObj).width( Width );
        console.log("ScaleProcessBarUnderImagesInMobileView - html: " + $(".ProcessBar", ParentObj).html());

        var ParentObj2 = $(element).closest(".SourceWrapper");
        var Margin = Math.round(($(ParentObj2).width() - Width)/2);
        $(".ProcessBar", ParentObj).css("margin-left", Margin+"px");
    });
}


// OK
function interfaceChanger(ActiveLinkNum){
    $( document ).on('click', ".PagerButton", function(event){
        var PagerNum = $(this).text().replace("kilde","").trim();
        // $("#header").html(jsonData[parseInt(PagerNum)-1].userInterface.header);   // Shows the initial heading.
        $("#header").html("Find den røde tråd i kilderne");   // Shows the initial heading.
        
        // $("#subHeader").html(jsonData[parseInt(PagerNum)-1].userInterface.subHeader);    // Shows the initial subheading.
        $("#subHeader").html('Find temaerne i <span class="QuestionTask">kilde '+String(PagerNum)+'</span>. Klik på temaordene for hver enkelt kilde og sammenlign dem til sidst.');    // Shows the initial subheading.

        console.log("interfaceChanger - PagerNum: " + PagerNum); // + ' - ' + jsonData[parseInt(PagerNum)-1].userInterface.header);

        console.log("interfaceChanger - ActiveLinkNum: " + ActiveLinkNum);
    });
}


// OK
function countCorrectAnswers_NEW(jsonData){
    correct_total = 0;
    error_total = 0;
    var error_displayed_total = 0;
    var numOfQuestions = 0;
    for (k in jsonData){
        var correct = 0; var error_missed = 0; var error_wrong = 0; var error_displayed = 0;
        var answerArray = jsonData[k].quizData.correctAnswer;
        var numOfSrudentAnswers = $("#btnContainer_"+k+" > .btnPressed").length;
        var numOfCorrectAnswers = answerArray.length;
        jsonData[k].StudentAnswers = {Correct : [], Wrong: []};
        // for (var n in answerArray){
        for (var n = 0; n < TagArray.length; n++) {
            // if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed")){
            if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+n+")").hasClass("btnPressed")){
                if (elementInArray(jsonData[k].userInterface.btn, $("#btnContainer_"+k+" > .StudentAnswer:eq("+n+")").text())) {
                    correct++;   // Counting correct answers.
                    jsonData[k].StudentAnswers.Correct.push(n);
                    // $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").toggleClass("CorrectAnswer");
                    $("#btnContainer_"+k+" > .StudentAnswer:eq("+n+")").addClass("CorrectAnswer");
                }
            } else {
                error_missed++;  // Counting missed correct answers, eg. if there are two or more correct answers and the student does not answer all of the answers, then this counter counts the missed correct answers.
            }
            error_wrong += numOfSrudentAnswers - (correct + error_missed); // Counts all the wrong answers chosen by the student. 
            error_wrong = (error_wrong < 0) ?  0 : error_wrong;

            console.log("countCorrectAnswers - CurrentQuestionId: " + CurrentQuestionId + 
            "\nnumOfSrudentAnswers: " + numOfSrudentAnswers + ", numOfCorrectAnswers: " + numOfCorrectAnswers + 
            "\ncorrect: " + correct  + ", error_missed: " + error_missed  + ", error_wrong: " + error_wrong);
        }

        $("#btnContainer_"+k+" > .StudentAnswer").each(function( index, element ) {
            if (($(element).hasClass("btnPressed")) && !(elementInArray(jsonData[k].userInterface.btn, $(element).text() ))) {
                ++error_displayed;
                jsonData[k].StudentAnswers.Wrong.push(index);
                // $(element).toggleClass("WrongAnswer");
                $(element).addClass("WrongAnswer");
            }
        });

        // correct_total += (correct  // <-------------------------   IMPORTANT: THIS WILL GIVE TWO POINTS IF TWO CORRECT ANSWERS ARE GIVEN IN ONE QUESTION!!!
        correct_total += (correct >= 1)? 1 : 0;   // <-------------------------   IMPORTANT: THIS ENFORCES _ONE_ POINT IF THERE ARE TWO OR MORE CORRECT ANSWERS!!!!!
        error_total += error_wrong + error_missed - correct;
        error_displayed_total += error_displayed;

        ++numOfQuestions;
    }

    $(".QuestionCounter").text(correct_total+'/'+numOfQuestions);
    $(".ErrorCount").text(error_displayed_total);
    console.log("countCorrectAnswers - correct_total: " + correct_total + ", error_total: " + error_total + ", error_displayed_total: " + error_displayed_total);
}

// OK
function ShuffelArray(ItemArray){
    var NumOfItems = ItemArray.length;
    var NewArray = ItemArray.slice();  // Copy the array...
    var Item2; var TempItem1; var TempItem2;
    for (var Item1 = 0; Item1 < NumOfItems; Item1++) {
        Item2 = Math.floor( Math.random() * NumOfItems);
        TempItem1 = NewArray[Item1];
        TempItem2 = NewArray[Item2];
        NewArray[Item2] = TempItem1;
        NewArray[Item1] = TempItem2;
    }
    return NewArray;
}


function AddColorToPagerButtons(jsonData){
    $(".PagerButton").removeClass("btn-primary").addClass("btn-default");  // Removes the color of the selected btn
    for (k in jsonData){
        if (jsonData[k].StudentAnswers.Correct.length == jsonData[k].quizData.correctAnswer.length){
            // $(".PagerButton:eq("+k+")").addClass("btn-success");
            $(".PagerButton:eq("+k+")").addClass("CorrectAnswer");
        } 

        if (jsonData[k].StudentAnswers.Wrong.length > 0){
            // $(".PagerButton:eq("+k+")").removeClass("btn-success").addClass("btn-danger");
            $(".PagerButton:eq("+k+")").removeClass("CorrectAnswer").addClass("WrongAnswer");
        } 
        // btn-danger
    }
}



// OK
function returnDivTable_MAM(tableSelector, headerArray, subHeaderArray, bodyArray2D){
    // bodyArray2D = matrixTranspose(bodyArray2D);
    var HTML = '<div '+((tableSelector.indexOf("#")!==-1)?'id="'+tableSelector.replace("#","")+'"':((tableSelector.indexOf(".")!==-1)?'class="'+tableSelector.replace(".","")+'"':''))+'>';
    for (var y = 0; y < bodyArray2D.length; y++) {
        HTML += '<div class="DivRow"> <div class="DivRow_overlay">';
        if (headerArray.length > 0){  // Content in headerArray is not required - just an empty array 

            // HTML += '<div class="LeftContent col-sm-12 col-md-3">'+'<h4 class="LeftContentHeader">'+subHeaderArray[y]+'</h4>'+headerArray[y]+'</div>';

            HTML += '<h4 class="LeftContentHeader">'+subHeaderArray[y]+'</h4>';
            HTML += '<div class="LeftContent col-sm-12 col-md-3">'+headerArray[y]+'</div>';
            
        }
        HTML += '<div class="RightContent col-sm-12 col-md-9">';
        for (var x = 0; x < bodyArray2D[y].length; x++) {
            // HTML += '<div class="btn btn-default">'+bodyArray2D[y][x]+'</div>'+((bodyArray2D[y].length-1 == x)?'</div> <div class="Clear"></div> </div>':'');
            HTML += bodyArray2D[y][x]+((bodyArray2D[y].length-1 == x)?'</div> <div class="Clear"></div> </div> </div>':'');
        };
    };
    console.log("returnDivTable_MAM - HTML: " + HTML);
    return HTML;
}
// $("body").append(returnDivTable_MAM(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]]));


// Function that "interchanges" rows and columns in a matrix (2 dimensional array):  
function matrixTranspose(matrix) {
    var matrixTranspose = [];
    for (var x = 0; x < matrix[0].length; x++) {
        var rowArray = [];
        for (var y = 0; y < matrix.length; y++) {
            rowArray.push(matrix[y][x]);
        }
        matrixTranspose.push(rowArray);
    };
    // console.log("matrixTranspose: " + JSON.stringify(matrixTranspose));
    return matrixTranspose;
}
console.log("matrixTranspose 1: " + JSON.stringify(matrixTranspose([["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]])));
console.log("matrixTranspose 2: " + JSON.stringify(matrixTranspose([["B11","B21","B31","B41"],["B12","B22","B32","B42"],["B13","B23","B33","B43"]])));


// OK
function ShiftToLowerColorClass(){
    var Count = 0;
    for (var n in TagArray){
        var Found = false;
        $(".CorrectAnswer").each(function( index, element ) {
            if ($(element).hasClass("TColorClass_"+n)){  // ONLY IF ONE OR MORE INSTANCES OF THE SAME THEME EXISTS...
            // if ( ($(element).hasClass("TColorClass_"+n)) && ($(".TColorClass_"+n).length > 1) ) {  // ONLY IF TWO OR MORE INSTANCES OF THE SAME THEME EXISTS...
                Found = true;
                $(element).addClass("ColorClass_"+Count);
                $(element).addClass("ColorClass");
                // $(element).removeClass("TColorClass_"+n);
            }
        });
        if (Found) ++Count;

        $(".CorrectAnswer").removeClass("TColorClass_"+n);
    }
}


function AutoAddColorsToColorClasses(){
    var CssProp = ["background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"];
    var cssObj = {};
    var HexStr1, HexStr2, HexStr3;
    for (var x = 0; x < NumOfUniqueTags; x++) {
        HexStr1 = (Math.round(Math.random()*150)+55).toString(16);
        HexStr2 = (Math.round(Math.random()*150)+55).toString(16);
        HexStr3 = (Math.round(Math.random()*150)+55).toString(16);
        for (var n in CssProp){
            cssObj[CssProp[n]] = "#"+HexStr1+HexStr2+HexStr3;
        }
        $(".ColorClass_"+x).css(cssObj);
    };
}


// OK
function DeactivateWrongAnswers(){
    for (var x = 0; x < NumOfUniqueTags; x++) {
        $(".ColorClass_"+x).each(function( index, element ) {
            if (!$(element).hasClass("StudentCorrect")){  // If the student has NOT marked the answer as correct, then..
                $(element).removeClass("ColorClass_"+x);  // ... remove the color-group / ColorClass
                $(element).addClass("XXX_ColorClass_"+x);  // ... add a fake ColorClass. This is not neeeded, but nice to have for testing.
            }
        });
    }
}


// OK
function MarkSomeCorrectAnswersAsWrong(){
    $(".StudentCorrect").each(function( index, element ) {
        if (!$(element).hasClass("ColorClass")){
            $(element).removeClass("StudentCorrect");
            $(element).addClass("XXX_StudentCorrect");
            $(element).addClass("StudentWrong");
        }
    });
}


// OK
function InsetProcessBars(jsonData){
    $(".DivRow").each(function( index1, element1 ) {

        $(".LeftContent", element1).append('<div class="ProcessBar"></div>');

        // var numOfCorrectAnswers = jsonData[index1].userInterface.btn.length; 
        var numOfCorrectAnswers = $(".ColorClass", element1).length; 
        var numOfCorrectStudentAnswers = 0;
        $(".StudentCorrect", element1).each(function( index2, element2 ) {
            if ( (elementInArray(jsonData[index1].userInterface.btn, $(element2).text())) && ($(element2).hasClass("ColorClass")) ){
                console.log("InsetProcessBars - btnArray: " + jsonData[index1].userInterface.btn + ", $(element2).text(): " + $(element2).text());
                ++numOfCorrectStudentAnswers;
            }
        });
        var Percentage = String(Math.round((numOfCorrectStudentAnswers/numOfCorrectAnswers)*100));
        var HTML = '<div id="ProcessBar_correct_'+index1+'" class="ProcessBar_correct">';
        HTML += '<div class="ProcessBarGauge_correct">'+Percentage+'%</div>';
        HTML += '</div>';
        $(".ProcessBar", element1).append(HTML);
        $('#ProcessBar_correct_'+index1+'> .ProcessBarGauge_correct').css('width',Percentage+'%');

        // $(".StudentWrong", element1).each(function( index2, element2 ) {
        //     if ( elementInArray(jsonData[index1].userInterface.btn, $(element2).text()) ){
        //         console.log("InsetProcessBars - btnArray: " + jsonData[index1].userInterface.btn + ", $(element2).text(): " + $(element2).text());
        //         ++numOfCorrectStudentAnswers;
        //     }
        // });

        // var numOfWrongAnswers = NumOfUniqueTags - jsonData[index1].userInterface.btn.length; 
        var numOfWrongAnswers = TagArray.length - $(".ColorClass", element1).length;  // jsonData[index1].userInterface.btn.length; 
        var numOfWrongStudentAnswers = $(".StudentWrong", element1).length;
        Percentage = String(Math.round((numOfWrongStudentAnswers/numOfWrongAnswers)*100));
        var HTML = '<div id="ProcessBar_wrong_'+index1+'" class="ProcessBar_wrong">';
        HTML += '<div class="ProcessBarGauge_wrong">'+Percentage+'%</div>';
        HTML += '</div>';
        $(".ProcessBar", element1).append(HTML);
        $('#ProcessBar_wrong_'+index1+'> .ProcessBarGauge_wrong').css('width',Percentage+'%');
    });
}


// OK
function makeEndGameSenario_4(jsonData){
    var sourceArray = [];
    var subHeaderArray = [];
    var correctAnswerMatrix = [];  // 2 dimensional array!
    var MaxLength = 0; var Length;
    for (n in jsonData) {
        Length = jsonData[n].userInterface.btn.length;
        if (Length > MaxLength) MaxLength = Length;
    }
    console.log("makeEndGameSenario - MaxLength: " + MaxLength);
    for (n in jsonData) {
        sourceArray.push(returnSourcelItem(n, jsonData));
        subHeaderArray.push(jsonData[n].userInterface.AnswerOverViewText);
        var rowArray = [];
        // correctAnswerMatrix.push(jsonData[n].userInterface.btn);  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.

        // for (var k = 0; k < MaxLength; k++) {
        for (var k = 0; k < TagArray.length; k++) {

                rowArray.push('<div class="btn btn-default '+((elementInArray(jsonData[n].userInterface.btn, TagArray[k]))?'CorrectAnswer ':'')+
                                             ((elementInArray(jsonData[n].StudentAnswers.Correct, k))?'StudentCorrect ':'')+
                                             ((elementInArray(jsonData[n].StudentAnswers.Wrong, k))?'StudentWrong ':'')+
                                             ((elementInArray(jsonData[n].userInterface.btn, TagArray[k]))?'TColorClass_'+k:'')+'">'
                                             +TagArray[k]+
                              '</div>');  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        }
        correctAnswerMatrix.push(rowArray);
    }
    console.log("makeEndGameSenario - jsonData: " + JSON.stringify(jsonData));  // '<div class="">'
    console.log("makeEndGameSenario - correctAnswerMatrix: " + JSON.stringify(correctAnswerMatrix));  // '<div class="">'

    var HTML = '<div id="EndGameSenario">' + returnDivTable_MAM('.resultTable', sourceArray, subHeaderArray, correctAnswerMatrix) + '</div>';

    return HTML;
}



$(document).on('click', ".StudentAnswer", function(event) {
    // event.preventDefault(); // Prevents sending the user to "href". 

    if (jsonData[parseInt(ActiveLinkNum)-1].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
        UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse. Vælg en ny kilde og lav en ny besvarelse.");
        UserMsgBox_SetWidth(".container-fluid", 0.7);
    } else {
        if ($(this).hasClass("btnPressed")){
            $(this).removeClass("btnPressed CorrectAnswer WrongAnswer");
        } else {
            $(this).toggleClass("btnPressed");
        }

        // if ($(this).hasClass("btnPressed"))
        //     $(this).css(CSS_OBJECT.btnPressed);
        // else
        //     $(this).css(CSS_OBJECT.StudentAnswer);
    }

});

$(document).on('click', ".checkAnswer", function(event) {
    // event.preventDefault(); // Prevents sending the user to "href".

    if (jsonData[parseInt(ActiveLinkNum)-1].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
        UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse. Vælg en ny kilde og lav en ny besvarelse.");
        UserMsgBox_SetWidth(".container-fluid", 0.7);
    } else {
        // countCorrectAnswers(jsonData);
        countCorrectAnswers_NEW(jsonData);

        // Gives the right answer a green color, and display a list of feedback:
        $("#btnContainer_"+String(parseInt(ActiveLinkNum)-1)+" > .StudentAnswer").each(function( index, element ) {

            console.log("checkAnswer - index: " + index);
            // if ($(element).hasClass("CorrectAnswer")) 
            //     $(element).css(CSS_OBJECT.CorrectAnswer); // Sets the color to the style of .CorrectAnswer which is green...
    
            if ($(element).hasClass("btnPressed")){  // Only if the student has marked an answer as correct, do...
                jsonData[parseInt(ActiveLinkNum)-1].answered = true; // Locks the student question for further answers/alterations to their first/initial answer.
                // if (!$(element).hasClass("CorrectAnswer"))
                //     $(element).css(CSS_OBJECT.WrongAnswer); // Sets the color to the style of .WrongtAnswer which is red...
                // giveFeedback(jsonData, CurrentQuestionId);   // Give feedback
            }
        });

    }
});

// Functionality that displays the results for the student.
$(document).on('click', ".checkAllAnswers", function(event) { 
    // countCorrectAnswers(jsonData);
    countCorrectAnswers_NEW(jsonData);
    // AddColorToPagerButtons(jsonData);   // TLY does nor want correct/wrong colors on pagerbuttons.
    $(".PagerButton").removeClass("btn-primary").addClass("btn-default");  // Remove the "choosen" pagerbutton.

    // $("#AnswerOverview").html(makeEndGameSenario_3(jsonData));
    $("#AnswerOverview").html(makeEndGameSenario_4(jsonData));
    $("#header").text("Find den røde tråd i kilderne");
    // $("#header_2").text("Sammenlign temaerne i kilderne");
    $("#subHeader").html('<span class="QuestionTask">Sammenlign temaerne</span> i kilderne. Farverne viser hvilke temaord der går <span class="QuestionTask">på tværs</span> af kilderne.');
    $("#DataInput").hide();
    $(".checkAllAnswers").hide();
    $(".TextHolder p").hide();
    ShiftToLowerColorClass();
    DeactivateWrongAnswers();
    MarkSomeCorrectAnswersAsWrong();
    InsetProcessBars(jsonData);
    ScaleProcessBarUnderImagesInMobileView();
    AutoAddColorsToColorClasses();  // <---- 

    // $("#AnswerOverview").html(makeEndGameSenario_3(jsonData));
}); 

// Returns "focus" to the quiz-mode once on of the pager buttons are pressed.
$(document).on('click', ".PagerButton", function(event) {
    if ($("#AnswerOverview").html()){  // If AnswerOverview has content (which is only when viewing the result of the quiz), do...
        // $("#header").show();
        // $("#header_2").show();
        $("#DataInput").show();        // Show the requested source (requestedby pressing the pager).
        $(".checkAllAnswers").show();
        $(".TextHolder p").show();
        $("#AnswerOverview").html(""); // "Hide"/overwrite the content in AnswerOverview.
    } 
}); 


$(document).on('click', ".resultTable .LeftContent", function(event) {
    ActiveLinkNum = $(this).parent().prevAll().length + 1;  // Find the sibling number.
    console.log("ActiveLinkNum: " + ActiveLinkNum);

    $("#DataInput").show();        // Show the requested source (requestedby pressing the pager).
    $(".checkAllAnswers").show();
    $(".TextHolder p").show();
    $("#AnswerOverview").html(""); // "Hide"/overwrite the content in AnswerOverview.

    Pager("#PagerContainer", "#DataInput > div", "Pager");

    // $("#header").html(jsonData[ActiveLinkNum-1].userInterface.header);   // Shows the heading.
    $("#header").html("Find den røde tråd i kilderne");   // Shows the initial heading.

    // $("#subHeader").html(jsonData[ActiveLinkNum-1].userInterface.subHeader);    // Shows the subheading.
    $("#subHeader").html('Find temaerne i <span class="QuestionTask">kilde '+String(ActiveLinkNum)+'</span>. Klik på temaordene for hver enkelt kilde og sammenlign dem til sidst.');    // Shows the initial subheading.
});


$(document).on('click', ".Source img", function(event) {
    console.log("Source - ActiveLinkNum: " + ActiveLinkNum-1 + ", jsonData[ActiveLinkNum].quizData.kildeData.src: " + jsonData[ActiveLinkNum-1].quizData.kildeData.src);
   
    // $(".Source").append("<div data-toggle='modal' data-target='#myModal'><img class='pic' src='" + jsonData[ActiveLinkNum-1].quizData.kildeData.src + "'></div>");
    // var parent_height = $(".pic").parent().parent().height();
    // console.log("parent_height: " + parent_height);
    // $(".pic").css("height" , parent_height);
    modal();
    $(".modal-body").html('<h4>'+jsonData[ActiveLinkNum-1].userInterface.AnswerOverViewText+"</h4><img src='" + jsonData[ActiveLinkNum-1].quizData.kildeData.src + "'/>");
});


$(document).on('click', ".DivRow", function(event) {
    ActiveLinkNum = $(this).prevAll().length + 1;  // Find the sibling number.
    console.log("ActiveLinkNum: " + ActiveLinkNum);

    $("#DataInput").show();        // Show the requested source (requestedby pressing the pager).
    $(".checkAllAnswers").show();
    $(".TextHolder p").show();
    $("#AnswerOverview").html(""); // "Hide"/overwrite the content in AnswerOverview.

    Pager("#PagerContainer", "#DataInput > div", "Pager");

    // $("#header").html(jsonData[ActiveLinkNum-1].userInterface.header);   // Shows the heading.
    $("#header").html("Find den røde tråd i kilderne");   // Shows the initial heading.

    // $("#subHeader").html(jsonData[ActiveLinkNum-1].userInterface.subHeader);    // Shows the subheading.
    $("#subHeader").html('Find temaerne i <span class="QuestionTask">kilde '+String(ActiveLinkNum)+'</span>. Klik på temaordene for hver enkelt kilde og sammenlign dem til sidst.');    // Shows the initial subheading.
})


// ================================
//      Pager
// ================================


var Range = 9;
var ActiveLinkNum = 1;

// Pager("#PagerContainer", "#FormsContainer > div", "Pager");
function Pager(PagerSelector, TargetSelectorChild, CssId) {

    var NumOfPages = 0;
    $(TargetSelectorChild).each(function(index, element) {
        ++NumOfPages;
    });
    console.log("NumOfPages : " + NumOfPages);


    var HTML = '<ul id="' + CssId + '" class="PagerClass">';

    // MARK XXX

    if (NumOfPages == 1) {
        HTML += '<li><a href="#" class="PagerButton btn btn-default"> Kilde 1 </a></li>';
    }

    if ((1 < NumOfPages) && (NumOfPages <= Range + 1)) {
        for (var i = 1; i <= NumOfPages; i++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">Kilde ' + i + '</a></li>';
        }
    }

    if (NumOfPages > Range + 1) {
        var StartIndex = ActiveLinkNum - Math.round((Range - 1) / 2); // Find the startindex based on ActiveLinkNum
        if (StartIndex < 1) StartIndex = 1; // Ajust startindex for low ActiveLinkNum
        if (Range + StartIndex > NumOfPages) StartIndex = NumOfPages - Range; // Ajust startindex for high ActiveLinkNum

        // StartIndex = Math.round((NumOfPages - Range)/2);
        console.log("StartIndex : " + StartIndex);


        if (StartIndex == 2) { // Ugly special case...
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> Kilde 1 </a></li>';
        }
        if (StartIndex > 2)
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> Kilde 1 </a></li><li> ... </li>';
        for (var j = StartIndex; j < Range + StartIndex; j++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">Kilde ' + j + '</a></li>';
        }
        if (Range + StartIndex == NumOfPages)
            for (var k = Range + StartIndex; k <= NumOfPages; k++) {
                HTML += '<li><a href="#" class="PagerButton btn btn-default">Kilde ' + k + '</a></li>';
            } else
                HTML += '<li> ... </li><li><a href="#" class="PagerButton btn btn-default">Kilde ' + NumOfPages + '</a></li>';

    }
    HTML += '</ul>';

    // Generate the pager:
    $(PagerSelector).html(HTML);

    $(TargetSelectorChild).removeClass("dshow");
    $(TargetSelectorChild + ":eq(" + (parseInt(ActiveLinkNum) - 1) + ")").addClass("dshow"); // TargetSelectorChild

    // 
    $("#" + CssId + " .PagerButton").click(function(e) {
        e.preventDefault(); // Prevent the link-nature of the anchor-tag.
        $("#" + CssId + " .PagerButton").removeClass("btn-default btn-primary");
        $("#" + CssId + " .PagerButton").addClass("btn-default");
        $(this).toggleClass("btn-default btn-primary");

        ActiveLinkNum = $(this).text().replace("Kilde","").trim();
        console.log("ActiveLinkNum 2: " + ActiveLinkNum);

        // TargetSelectorChildText = $(TargetSelectorChild).text();
        // console.log("TargetSelectorChildText: " + TargetSelectorChildText);


        Pager(PagerSelector, TargetSelectorChild, CssId); // Update the pager by recursive call
    });

    var LastElement = null;

    // Set the chosen color if the pager-button is showen:
    $(PagerSelector + " li a").each(function(index, element) {
        if ($(element).text().replace("Kilde","").trim() == ActiveLinkNum) {
            $(element).toggleClass("btn-default btn-primary");
        }
        LastElement = element;
    });

    // If the last STOP (n) is selected, and the user deletes the current STOP (n), then the user needs to "routed" to the second-last STOP (n-1):
    if ( ActiveLinkNum > NumOfPages){
        ActiveLinkNum = NumOfPages;
        $(LastElement).toggleClass("btn-default btn-primary");
        $(TargetSelectorChild + ":eq(" + (parseInt(ActiveLinkNum) - 1) + ")").addClass("dshow"); // TargetSelectorChild
    }

    console.log("ActiveLinkNum 1: " + ActiveLinkNum + ", NumOfPages: " + NumOfPages);
}


// ================================
//      Run code
// ================================


$(document).ready(function() {
// $(window).load(function() {


    var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj) + ", UlrVarObj.file: " + UlrVarObj.file);

    ReturnAjaxData("GET", "json/QuizData"+String(UlrVarObj.file)+".json", false, "json");
    // ReturnAjaxData("GET", "json/QuizData100.json", false, "json");

    TagArray = GetAllUniqueTags(jsonData);

    TagArray = ShuffelArray(TagArray);

    // $("#header").html(jsonData[0].userInterface.header);   // Shows the initial heading.
    $("#header").html("Find den røde tråd i kilderne");   // Shows the initial heading.

    // $("#subHeader").html(jsonData[0].userInterface.subHeader);    // Shows the initial subheading.
    $("#subHeader").html('Find temaerne i <span class="QuestionTask">kilde '+String(ActiveLinkNum)+'</span>. Klik på temaordene for hver enkelt kilde og sammenlign dem til sidst.');    // Shows the initial subheading.

    $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

    // ==================================

    $("#DataInput").html(returnSourcePages(jsonData));
    // modal();

    Pager("#PagerContainer", "#DataInput > div", "Pager");

    interfaceChanger(ActiveLinkNum);

    $(window).load(function () {
        // $(".NoteField").height($(".Source").height());
    });

    $(window).resize(function () {
        ScaleProcessBarUnderImagesInMobileView();
    });

    // ====================   TEST  ===================

    // randomizeJsonData(jsonData);
});