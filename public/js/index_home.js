$('#quantity').on('keypress', function(event){
    console.log(event.key)

    for (let i=1;i<11;i++){
        var id = "#label-" + i
        if (i <= event.key){
            $(id).css("display","block")
            $(id).attr("disabled","true")
        }else {
            $(id).css("display","none")
            $(id).attr("disabled","false")

        }
    }
})


$('#quantity').on('click', function(event){
    var quantity =  $('#quantity').val()

    for (let i=1;i<11;i++){
        var id = "#label-" + i
        var input_id = "#url_label_" + i
        if (i <= quantity){
            $(id).css("display","block")
            $(input_id).attr("disabled",false)

        }else {
            $(id).css("display","none")
            $(input_id).attr("disabled",true)


        }
    }
})

// document.getElementById("quantity").addEventListener("click", function(){
//     document.getElementById.style.display = "block";
// })

