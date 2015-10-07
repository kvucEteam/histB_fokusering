var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;

// MARK 4


function elementInArray(tArray, element){
    for (x in tArray){
        if (tArray[x] == element) return true 
    }
    return false;
}
console.log("elementInArray - true: " + elementInArray([1,2,3,4,5], 3));
console.log("elementInArray - false: " + elementInArray([1,2,3,4,5], 6));



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


function returnSourcePages(jsonData){
    var HTML = '';
    for (n in jsonData) {
        HTML += '<div class="SourcePage">';
        
        HTML +=     '<div class="Source">'+returnSourcelItem(n, jsonData)+'</div>';
        // HTML +=     '<div class="NoteField">'+'Placer et felt til kursistens noter her? <br/> <i>Note '+String(parseInt(n)+1)+': Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam...</i></div>';
        // HTML +=     '<div class="Clear"></div>';
        

        // // THIS IF-CLAUSE IS ONLY TEMPORARY CODE (THE CONTENT INSIDE THE IF-CLAUSE IS OK):
        // if (jsonData[n].userInterface.hasOwnProperty("btnHastagStr")){
        //     jsonData[n].userInterface.btn = [];
        //     jsonData[n].userInterface.btn = hastagStrToArray(jsonData[n].userInterface.btnHastagStr);
        //     console.log("returnSourcePages - hastagStrToArray: " + jsonData[n].userInterface.btn);
        // }

        HTML +=     '<div '+'id="btnContainer_'+n+'" class="BtnContainer">';
        var btnArray = jsonData[n].userInterface.btn;
        for (m in btnArray){
            HTML += '<span class="btn btn-default StudentAnswer">'+btnArray[m]+'</span>';
        }
            HTML += '</div>';
        HTML += '</div>';
    }
    return HTML;
}


function returnSourcelItem(questionNum, jsonData){
    var itemData = jsonData[questionNum].quizData;
    var HTML = '';
    switch(itemData.kildeData.type) {
        case "img":
            HTML += '<img class="img-responsive" src="'+itemData.kildeData.src+'" alt="'+itemData.kildeData.alt+'"/>';
            break;
        case "text":
            HTML += '<div class="TextHolder">'+itemData.kildeData.text+'</div>';
            break;
        case "video":
            HTML += '<div class="embed-responsive embed-responsive-16by9 col-xs-12 col-md-12">' + 
                        '<iframe class="embed-responsive-item" src="'+itemData.kildeData.src+'?rel=0" allowfullscreen="1"></iframe>' + 
                    '</div>';
            break;
        default:
            alert('Invalid "type"');
    }
    console.log("returnSourcelItem: " + HTML);
    return HTML;
}


function interfaceChanger(ActiveLinkNum){
    $( document ).on('click', ".PagerButton", function(event){
        var PagerNum = $(this).text();
        $("#header").html(jsonData[parseInt(PagerNum)-1].userInterface.header);   // Shows the initial heading.
        $("#subHeader").html(jsonData[parseInt(PagerNum)-1].userInterface.subHeader);    // Shows the initial subheading.

        console.log("interfaceChanger - PagerNum: " + PagerNum); // + ' - ' + jsonData[parseInt(PagerNum)-1].userInterface.header);

        console.log("interfaceChanger - ActiveLinkNum: " + ActiveLinkNum);
    });
}


function countCorrectAnswers(jsonData){
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
        for (var n in answerArray){
            if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed")){
                correct++;   // Counting correct answers.
                jsonData[k].StudentAnswers.Correct.push(answerArray[n]);
                // $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").toggleClass("CorrectAnswer");
                $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").addClass("CorrectAnswer");
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
            if (($(element).hasClass("btnPressed")) && !(elementInArray(answerArray, index))){
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

function SwitchElements(TargetArray, TRanArray){
    var TArray = TargetArray.slice();  // Copy the array...
    var E1, E2;
    for (n in TRanArray){
        TArray[TRanArray[n]] = TargetArray[n];
    }
    console.log("SwitchElements - TArray: " + TArray);
    return TArray;
}
SwitchElements(["a","b","c","d","e"],[0,1,2,3,4]);
SwitchElements(["a","b","c","d","e"],[4,3,2,1,0]);


function RemoveAbsentElements(TargetArray, ElementsToKeepArray){

}


function randomizeJsonData(jsonData){
    for (n in jsonData){
        var ArrayLength = jsonData[n].userInterface.btn.length;
        var TRanArray = [];
        for (var i = 0; i < ArrayLength; i++) {
            TRanArray.push(i);
        };
        console.log("randomizeJsonData - TRanArray: " + TRanArray);
        var RanTAnsArray = ShuffelArray(TRanArray);
        console.log("randomizeJsonData - RanTAnsArray: " + RanTAnsArray);

        console.log("randomizeJsonData - jsonData["+n+"] - btn 1: " + jsonData[n].userInterface.btn);
        console.log("randomizeJsonData - jsonData["+n+"] - btn 2B: " + SwitchElements(jsonData[n].userInterface.btn, RanTAnsArray));
        console.log("randomizeJsonData - jsonData["+n+"] - btn 2: " + jsonData[n].userInterface.btn);
        // jsonData.userInterface.btn = SwitchElements(jsonData.userInterface.btn, RanTAnsArray);
        console.log("randomizeJsonData - jsonData["+n+"] - feedbackData 1: " + jsonData[n].quizData.feedbackData);
        jsonData[n].quizData.feedbackData = SwitchElements(jsonData[n].quizData.feedbackData, RanTAnsArray);
        console.log("randomizeJsonData - jsonData["+n+"] - feedbackData 2: " + jsonData[n].quizData.feedbackData);
    }
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


function returnDivTable(tableSelector, headerArray, bodyArray2D){
    bodyArray2D = matrixTranspose(bodyArray2D);
    var HTML = '<div '+((tableSelector.indexOf("#")!==-1)?'id="'+tableSelector.replace("#","")+'"':((tableSelector.indexOf(".")!==-1)?'class="'+tableSelector.replace(".","")+'"':''))+'>';
    for (var y = 0; y < bodyArray2D.length; y++) {
        HTML += '<div class="DivColumn">';
        if (headerArray.length > 0){  // Content in headerArray is not required - just an empty array 
            HTML += '<div class="tth">'+headerArray[y]+'</div>';
        }
        for (var x = 0; x < bodyArray2D[y].length; x++) {
            HTML += '<div class="ttd">'+bodyArray2D[y][x]+'</div>'+((bodyArray2D[y].length-1 == x)?'</div>':'');
        };
    };
    HTML += '</div>';
    console.log("returnTable - HTML: " + HTML);
    return HTML;
}
// $("body").append(returnDivTable(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]]));


function returnTextPart(objectText, Maxlength){
    if (objectText.indexOf(" ", Maxlength) !== -1)
        return objectText.substr(0,objectText.indexOf(" ", Maxlength), Maxlength)+"...";
    else
        return objectText;
}
console.log("returnTextPart: " + returnTextPart("a b c d", 10));
console.log("returnTextPart: " + returnTextPart("a b c d e f g h i j k l", 10));




function returnDivTable_MAM(tableSelector, headerArray, bodyArray2D){
    // bodyArray2D = matrixTranspose(bodyArray2D);
    var HTML = '<div '+((tableSelector.indexOf("#")!==-1)?'id="'+tableSelector.replace("#","")+'"':((tableSelector.indexOf(".")!==-1)?'class="'+tableSelector.replace(".","")+'"':''))+'>';
    for (var y = 0; y < bodyArray2D.length; y++) {
        HTML += '<div class="DivRow">';
        if (headerArray.length > 0){  // Content in headerArray is not required - just an empty array 
            HTML += '<div class="LeftContent">'+headerArray[y]+'</div>';
            // HTML += '<div class="LeftContent">'+((jsonData[y].quizData.kildeData.type == "text")? returnTextPart(headerArray[y], 200) : headerArray[y] )+'</div>';
        }
        HTML += '<div class="RightContent">';
        for (var x = 0; x < bodyArray2D[y].length; x++) {
            // HTML += '<div class="btn btn-default">'+bodyArray2D[y][x]+'</div>'+((bodyArray2D[y].length-1 == x)?'</div> <div class="Clear"></div> </div>':'');
            HTML += bodyArray2D[y][x]+((bodyArray2D[y].length-1 == x)?'</div> <div class="Clear"></div> </div>':'');
        };
    };
    console.log("returnDivTable_MAM - HTML: " + HTML);
    return HTML;
}
// $("body").append(returnDivTable_MAM(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]]));


function returnDivTable_row(tableSelector, headerArray, bodyArray2D){
    bodyArray2D = matrixTranspose(bodyArray2D);
    var HTML = '<div '+((tableSelector.indexOf("#")!==-1)?'id="'+tableSelector.replace("#","")+'"':((tableSelector.indexOf(".")!==-1)?'class="'+tableSelector.replace(".","")+'"':''))+'>';
    HTML += '<div class="DivRow">';
    
    if (headerArray.length > 0){  // Content in headerArray is not required - just an empty array 
        for (var y = 0; y < headerArray.length; y++) {
            HTML += '<div class="ttd">'+headerArray[y]+'</div>';
        };
    }
    
    HTML += '</div>';
    for (var y = 0; y < bodyArray2D.length; y++) {
        HTML += '<div class="DivRow">';
        for (var x = 0; x < bodyArray2D[y].length; x++) {
            HTML += '<div class="ttd">'+bodyArray2D[y][x]+'</div>'+((bodyArray2D[y].length-1 == x)?'</div>':'');
        };
    };
    HTML += '</div>';
    console.log("returnDivTable_row - HTML: " + HTML);
    return HTML;
}
// $("body").append(returnDivTable_row(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]]));



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


// MARK 5

function makeEndGameSenario_2(jsonData){
    var sourceArray = [];
    var correctAnswerMatrix = [];  // 2 dimensional array!
    var MaxLength = 0; var Length;
    for (n in jsonData) {
        Length = jsonData[n].userInterface.btn.length;
        if (Length > MaxLength) MaxLength = Length;
    }
    console.log("makeEndGameSenario - MaxLength: " + MaxLength);
    for (n in jsonData) {
        sourceArray.push(returnSourcelItem(n, jsonData));
        var rowArray = [];
        // correctAnswerMatrix.push(jsonData[n].userInterface.btn);  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        
        // for (k in jsonData[n].userInterface.btn){
        //     rowArray.push('<div class="'+((elementInArray(jsonData[n].quizData.correctAnswer, k))?'CorrectAnswer ':'')+
        //                                  ((elementInArray(jsonData[n].StudentAnswers.Correct, k))?'StudentCorrect ':'')+
        //                                  ((elementInArray(jsonData[n].StudentAnswers.Wrong, k))?'StudentWrong ':'')+'">'
        //                                  +jsonData[n].userInterface.btn[k]+
        //                   '</div>');  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        // }

        for (var k = 0; k < MaxLength; k++) {
        // for (k in jsonData[n].userInterface.btn){
            if (typeof(jsonData[n].userInterface.btn[k]) !== "undefined"){
                rowArray.push('<div class="'+((elementInArray(jsonData[n].quizData.correctAnswer, k))?'CorrectAnswer ':'')+
                                             ((elementInArray(jsonData[n].StudentAnswers.Correct, k))?'StudentCorrect ':'')+
                                             ((elementInArray(jsonData[n].StudentAnswers.Wrong, k))?'StudentWrong ':'')+'">'
                                             +jsonData[n].userInterface.btn[k]+
                              '</div>');  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
            } else {
                rowArray.push('<div class="Empty">&nbsp;</div>');
            }
        }
        correctAnswerMatrix.push(rowArray);
    }
    console.log("makeEndGameSenario - jsonData: " + JSON.stringify(jsonData));  // '<div class="">'
    console.log("makeEndGameSenario - correctAnswerMatrix: " + JSON.stringify(correctAnswerMatrix));  // '<div class="">'

    // DETTE ER EN TEST:
    var HTML = '<div id="EndGameSenario">' + returnDivTable_row('.resultTable', sourceArray, correctAnswerMatrix) + '</div>';

    // DETTE VIRKER OK:
    // var TcorrectAnswerMatrix = matrixTranspose(correctAnswerMatrix);
    // console.log("makeEndGameSenario - TcorrectAnswerMatrix: " + JSON.stringify(TcorrectAnswerMatrix));
    // var HTML = '<div id="EndGameSenario">' + returnDivTable('.resultTable', sourceArray, TcorrectAnswerMatrix) + '</div>';


    UserMsgBox("body", HTML);
    // UserMsgBox_SetWidth(".container-fluid", 0.7);

    // $("#DataInput").append(HTML);

    // $("#EndGameSenario th").css("width", String(100/sourceArray.length)+'%');
    $("#EndGameSenario .ttd").css("width", String(Math.floor(100/jsonData.length)-0.1)+'%');

}


function makeEndGameSenario_3(jsonData){
    var sourceArray = [];
    var correctAnswerMatrix = [];  // 2 dimensional array!
    var MaxLength = 0; var Length;
    for (n in jsonData) {
        Length = jsonData[n].userInterface.btn.length;
        if (Length > MaxLength) MaxLength = Length;
    }
    console.log("makeEndGameSenario - MaxLength: " + MaxLength);
    for (n in jsonData) {
        sourceArray.push(returnSourcelItem(n, jsonData));
        var rowArray = [];
        // correctAnswerMatrix.push(jsonData[n].userInterface.btn);  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        
        // for (k in jsonData[n].userInterface.btn){
        //     rowArray.push('<div class="'+((elementInArray(jsonData[n].quizData.correctAnswer, k))?'CorrectAnswer ':'')+
        //                                  ((elementInArray(jsonData[n].StudentAnswers.Correct, k))?'StudentCorrect ':'')+
        //                                  ((elementInArray(jsonData[n].StudentAnswers.Wrong, k))?'StudentWrong ':'')+'">'
        //                                  +jsonData[n].userInterface.btn[k]+
        //                   '</div>');  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        // }

        for (var k = 0; k < MaxLength; k++) {
        // for (k in jsonData[n].userInterface.btn){
            if (typeof(jsonData[n].userInterface.btn[k]) !== "undefined"){
                rowArray.push('<div class="btn btn-default '+((elementInArray(jsonData[n].quizData.correctAnswer, k))?'XXX_CorrectAnswer ':'')+
                                             ((elementInArray(jsonData[n].StudentAnswers.Correct, k))?'XXX_StudentCorrect ':'')+
                                             ((elementInArray(jsonData[n].StudentAnswers.Wrong, k))?'XXX_StudentWrong ':'')+'">'
                                             +jsonData[n].userInterface.btn[k]+
                              '</div>');  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
            } else {
                rowArray.push('<div class="Empty">&nbsp;</div>');
            }
        }
        correctAnswerMatrix.push(rowArray);
    }
    console.log("makeEndGameSenario - jsonData: " + JSON.stringify(jsonData));  // '<div class="">'
    console.log("makeEndGameSenario - correctAnswerMatrix: " + JSON.stringify(correctAnswerMatrix));  // '<div class="">'

    // DETTE ER EN TEST:
    var HTML = '<div id="EndGameSenario">' + returnDivTable_MAM('.resultTable', sourceArray, correctAnswerMatrix) + '</div>';

    // DETTE VIRKER OK:
    // var TcorrectAnswerMatrix = matrixTranspose(correctAnswerMatrix);
    // console.log("makeEndGameSenario - TcorrectAnswerMatrix: " + JSON.stringify(TcorrectAnswerMatrix));
    // var HTML = '<div id="EndGameSenario">' + returnDivTable('.resultTable', sourceArray, TcorrectAnswerMatrix) + '</div>';


    // UserMsgBox("body", HTML);
    // $("#EndGameSenario .ttd").css("width", String(Math.floor(100/jsonData.length)-0.1)+'%');

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
        countCorrectAnswers(jsonData);

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
    countCorrectAnswers(jsonData);
    AddColorToPagerButtons(jsonData);

    $("#AnswerOverview").html(makeEndGameSenario_3(jsonData));
    $("#header").text("Svaroversigt");
    $("#DataInput").hide();
    $(".checkAllAnswers").hide();
    $(".TextHolder p").hide();
    // $("#AnswerOverview").html(makeEndGameSenario_3(jsonData));
}); 

// Returns "focus" to the quiz-mode once on of the pager buttons are pressed.
$(document).on('click', ".PagerButton", function(event) {
    if ($("#AnswerOverview").html()){  // If AnswerOverview has content (which is only when viewing the result of the quiz), do...
        // $("#header").show();
        $("#DataInput").show();        // Show the requested source (requestedby pressing the pager).
        $(".checkAllAnswers").show();
        $(".TextHolder p").show();
        $("#AnswerOverview").html(""); // "Hide"/overwrite the content in AnswerOverview.
    } 
}); 



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

    if (NumOfPages == 1) {
        HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
    }

    if ((1 < NumOfPages) && (NumOfPages <= Range + 1)) {
        for (var i = 1; i <= NumOfPages; i++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + i + '</a></li>';
        }
    }

    if (NumOfPages > Range + 1) {
        var StartIndex = ActiveLinkNum - Math.round((Range - 1) / 2); // Find the startindex based on ActiveLinkNum
        if (StartIndex < 1) StartIndex = 1; // Ajust startindex for low ActiveLinkNum
        if (Range + StartIndex > NumOfPages) StartIndex = NumOfPages - Range; // Ajust startindex for high ActiveLinkNum

        // StartIndex = Math.round((NumOfPages - Range)/2);
        console.log("StartIndex : " + StartIndex);


        if (StartIndex == 2) { // Ugly special case...
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
        }
        if (StartIndex > 2)
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li><li> ... </li>';
        for (var j = StartIndex; j < Range + StartIndex; j++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + j + '</a></li>';
        }
        if (Range + StartIndex == NumOfPages)
            for (var k = Range + StartIndex; k <= NumOfPages; k++) {
                HTML += '<li><a href="#" class="PagerButton btn btn-default">' + k + '</a></li>';
            } else
                HTML += '<li> ... </li><li><a href="#" class="PagerButton btn btn-default">' + NumOfPages + '</a></li>';

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

        ActiveLinkNum = $(this).text();
        console.log("ActiveLinkNum 2: " + ActiveLinkNum);

        // TargetSelectorChildText = $(TargetSelectorChild).text();
        // console.log("TargetSelectorChildText: " + TargetSelectorChildText);


        Pager(PagerSelector, TargetSelectorChild, CssId); // Update the pager by recursive call
    });

    var LastElement = null;

    // Set the chosen color if the pager-button is showen:
    $(PagerSelector + " li a").each(function(index, element) {
        if ($(element).text() == ActiveLinkNum) {
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

 //    var CssProp = ["background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color"];
 //    getCss([".StudentAnswer", ".CorrectAnswer", ".WrongAnswer", ".btnPressed", ".WrongAnswer_hover"], CssProp);
 //    console.log("CSS_OBJECT: " + CSS_OBJECT);


    var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj) + ", UlrVarObj.file: " + UlrVarObj.file);

    ReturnAjaxData("GET", "json/QuizData"+String(UlrVarObj.file)+".json", false, "json");
    // ReturnAjaxData("GET", "json/QuizData100.json", false, "json");

 //        	// returnQuizlHtml(0, jsonData);  // TEST

 //        	// returnCarouselItem(3, jsonData);  // TEST

 //        	// returnCarouseList(jsonData);      // TEST

 //    // $("#DataInput").html(returnQuizlHtml(0, jsonData));  // Insert carousel HTML

 //    console.log("jsonData: " + JSON.stringify(jsonData) );

    $("#header").html(jsonData[0].userInterface.header);   // Shows the initial heading.
    $("#subHeader").html(jsonData[0].userInterface.subHeader);    // Shows the initial subheading.

 //    $(".btnContainer").hide();      // Hides all button containers.
 //    $("#btnContainer_"+0).show();   // Shows the first button container.

    $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

 //    // CheckStudentAnswers(jsonData);

	// userInterfaceChanger(jsonData);

 //    hoverCss([".CorrectAnswer_hover", ".WrongAnswer_hover"]);


    // ==================================

    $("#DataInput").html(returnSourcePages(jsonData));

    Pager("#PagerContainer", "#DataInput > div", "Pager");

    interfaceChanger(ActiveLinkNum);

    // makeEndGameSenario(jsonData);
    // makeEndGameSenario_2(jsonData);

    $(window).load(function () {
        // $(".NoteField").height($(".Source").height());
    });

    $(window).resize(function () {
        // $(".NoteField").height($(".Source").height());
    });

    // ====================   TEST  ===================

    // randomizeJsonData(jsonData);
});