
const firebaseConfig = {
    apiKey: "AIzaSyDMXaX8AR8MKDoZohHewzphFERUEubVm0Y",
    authDomain: "assests-managment.firebaseapp.com",
    databaseURL: "https://assests-managment.firebaseio.com",
    projectId: "assests-managment",
    storageBucket: "assests-managment.appspot.com",
    messagingSenderId: "429074630365",
    appId: "1:429074630365:web:62f74225288877aa"
};
firebase.initializeApp(firebaseConfig);
var messagesRef = firebase.database().ref('Capax');
$('#capaxdetails').submit(function (e) {
    $(this),
        e.preventDefault();

    messagesRef.once("value").then(function (snapshot) {

        var a = snapshot.child(document.getElementById('exampleserailNumber_c').value).exists();
        if (!a) {
            window.alert("No Data");
            $('#capax')[0].reset();
            document.getElementById("examplepoDate").readOnly = false;
            document.getElementById('examplepoDate').value = "";
            document.getElementById("examplepoDate").readOnly = true;
            document.getElementById("exampleInvoiceDate").readOnly = false;
            document.getElementById('exampleInvoiceDate').value = "";
            document.getElementById("exampleInvoiceDate").readOnly = true;
            document.getElementById("exampleRecieveDate").readOnly = false;
            document.getElementById('exampleRecieveDate').value = "";
            document.getElementById("exampleRecieveDate").readOnly = true;
            document.getElementById('delete').style.visibility = "hidden";
            document.getElementById('edit').style.visibility = "hidden";
            document.getElementById('exampleserailNumber_c').value = "";
        } else {
            window.alert("Retrived  Succesfully");
            messagesRef.child(document.getElementById('exampleserailNumber_c').value).on("child_added", function (data) {

                document.getElementById('exampleserailNumber').value = data.val().serialNumber;
                document.getElementById('exampleSapCode').value = data.val().sapcode;
                document.getElementById('exampleMaterialCode').value = data.val().materialcode;
                document.getElementById('exampleMaterialQuantity').value = data.val().materialquantity;
                document.getElementById('examplepoNumber').value = data.val().ponumber;
                document.getElementById('examplepoDate').value = data.val().podate;
                document.getElementById('exampleInvoiceDate').value = data.val().invoiceDate;
                document.getElementById('exampleInvoiceNumber').value = data.val().invoiceNumber;
                document.getElementById('exampleRecieveDate').value = data.val().receiveDate;
                document.getElementById('exampleModel').value = data.val().model;
                document.getElementById('exampleModelDescp').value = data.val().modelDescp;
                document.getElementById('exampleUpdateSummit').value = data.val().summit;
                // $('.success-message').show();


                document.getElementById('delete').style.visibility = "visible";
                document.getElementById('edit').style.visibility = "visible";

            });
        }
    });

});

document.getElementById('delete').onclick = function () {
    var messagesRef = firebase.database().ref('Capax');
    if (confirm("Are you sure want to delete ?")) {
        messagesRef.child(document.getElementById('exampleserailNumber').value).remove();
        messagesRef.once("value").then(function (snapshot) {

            var a = snapshot.child(document.getElementById('exampleserailNumber').value).exists();
            if (a) {
                console.log("Not removed");
            } else {
                console.log('Removed');
                window.alert("Deleted Successfully.");
                document.getElementById("examplepoDate").readOnly = false;
                document.getElementById('examplepoDate').value = "";
                document.getElementById("examplepoDate").readOnly = true;
                document.getElementById("exampleInvoiceDate").readOnly = false;
                document.getElementById('exampleInvoiceDate').value = "";
                document.getElementById("exampleInvoiceDate").readOnly = true;
                document.getElementById("exampleRecieveDate").readOnly = false;
                document.getElementById('exampleRecieveDate').value = "";
                document.getElementById("exampleRecieveDate").readOnly = true;
                $('#capax')[0].reset();

                $('#capaxdetails')[0].reset();
                document.getElementById('delete').style.visibility = "hidden";
                document.getElementById('edit').style.visibility = "hidden";
                document.getElementById('update').style.visibility = "hidden";

                document.getElementById('exampleserailNumber').readOnly = true;
                document.getElementById('exampleSapCode').readOnly = true;
                document.getElementById('exampleMaterialCode').readOnly = true;
                document.getElementById('exampleMaterialQuantity').readOnly = true;
                document.getElementById('examplepoDate').readOnly = true;
                document.getElementById('examplepoNumber').readOnly = true;
                document.getElementById('exampleInvoiceDate').readOnly = true;
                document.getElementById('exampleInvoiceNumber').readOnly = true;
                document.getElementById('exampleRecieveDate').readOnly = true;
                document.getElementById('exampleModel').readOnly = true;
                document.getElementById('exampleModelDescp').readOnly = true;
                document.getElementById('exampleUpdateSummit').disabled = true;
            }
        });
    }
}
document.getElementById('edit').onclick = function () {

    document.getElementById('exampleserailNumber_c').readOnly = true;
    document.getElementById('btn_cap').disabled = true;
    document.getElementById('exampleserailNumber').readOnly = false;
    document.getElementById('exampleSapCode').readOnly = false;
    document.getElementById('exampleMaterialCode').readOnly = false;
    document.getElementById('exampleMaterialQuantity').readOnly = false;
    document.getElementById('examplepoDate').readOnly = false;
    document.getElementById('examplepoNumber').readOnly = false;
    document.getElementById('exampleInvoiceDate').readOnly = false;
    document.getElementById('exampleInvoiceNumber').readOnly = false;
    document.getElementById('exampleRecieveDate').readOnly = false;
    document.getElementById('exampleModel').readOnly = false;
    document.getElementById('exampleModelDescp').readOnly = false;
    document.getElementById('exampleUpdateSummit').disabled = false;

    document.getElementById('delete').style.visibility = "hidden";
    document.getElementById('edit').style.visibility = "hidden";
    document.getElementById('update').style.visibility = "visible";
   
};
$('#capax').submit(function (e) {
    $(this);
    e.preventDefault();

    $('#capax :input').change(function () {
        $('#capax').data('changed', true);
    });
    if (!$('#capax').data('changed')) {
        console.log("not changed");
        window.alert("No data changed");

    } else {
        console.log("changed");
        var messagesRef1 = firebase.database().ref('Capax');
        var newMessageRef = messagesRef1.child(document.getElementById('exampleserailNumber').value).push();
        newMessageRef.set({
            serialNumber: $('.snumber').val(),
            sapcode: $('.sapcode').val(),
            materialcode: $('.materialcode').val(),
            materialquantity: $('.materialquantity').val(),
            ponumber: $('.ponumber').val(),
            podate: $('.podate').val(),
            invoiceDate: $('.invoicedate').val(),
            invoiceNumber: $('.invoicenumber').val(),   
            receiveDate: $('.receivedate').val(),
            model: $('.model').val(),
            modelDescp: $('.modeldescp').val(),
            summit: $('.summit').val()
        }); 
        

        document.getElementById('delete').style.visibility = "hidden";
        document.getElementById('edit').style.visibility = "hidden";
        document.getElementById('update').style.visibility = "hidden";
        window.alert("Submitted Successfully");
        $('#capax')[0].reset();
        $('#capaxdetails')[0].reset();


        document.getElementById('exampleserailNumber_c').readOnly = false;
        document.getElementById('btn_cap').disabled = false;
        document.getElementById('exampleserailNumber').readOnly = true;
        document.getElementById('exampleSapCode').readOnly = true;
        document.getElementById('exampleMaterialCode').readOnly = true;
        document.getElementById('exampleMaterialQuantity').readOnly = true;
        document.getElementById('examplepoDate').readOnly = true;
        document.getElementById('examplepoNumber').readOnly = true;
        document.getElementById('exampleInvoiceDate').readOnly = true;
        document.getElementById('exampleInvoiceNumber').readOnly = true;
        document.getElementById('exampleRecieveDate').readOnly = true;
        document.getElementById('exampleModel').readOnly = true;
        document.getElementById('exampleModelDescp').readOnly = true;
        document.getElementById('exampleUpdateSummit').disabled = true;
    }
});





