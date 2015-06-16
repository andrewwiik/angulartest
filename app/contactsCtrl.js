app.controller('contactsCtrl', function ($scope, $modal, $filter, Data) {
    $scope.contact = {};
    Data.get('contacts').then(function(data){
        $scope.contacts = data.data;
    });
    $scope.changeContactStatus = function(contact){
        product.status = (product.status=="Active" ? "Inactive" : "Active");
        Data.put("contacts/"+contact.id,{status:contact.status});
    };
    $scope.deleteContact = function(contact){
        if(confirm("Are you sure to remove this Contact")){
            Data.delete("contacts/"+contact.id).then(function(result){
                $scope.contacts = _.without($scope.contacts, _.findWhere($scope.contacts, {id:contact.id}));
            });
        }
    };
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/contactsEdit.html',
          controller: 'contactEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.products.push(selectedObject);
                $scope.products = $filter('orderBy')($scope.contacts, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.landnumber = selectedObject.description;
                p.fname = selectedObject.price;
                p.lname = selectedObject.stock;
                p.mobilenumber = selectedObject.packing;
            }
        });
    };
    
 $scope.columns = [
                    {text:"First Name",predicate:"fname",sortable:true},
                    {text:"Last Name",predicate:"lname",sortable:true},
                    {text:"Mobile Number",predicate:"mobilenumber",sortable:true,dataType:"number"},
                    {text:"Home Number",predicate:"landnumber",sortable:true,dataType:"number"},
                    {text:"Street",predicate:"address",reverse:true,sortable:true},
                    {text:"City",predicate:"city",sortable:true},
                    {text:"Zip Code",predicate:"zipcode",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];

});


app.controller('contactsEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.contact = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.id > 0) ? 'Edit Contact' : 'Add Contact';
        $scope.buttonText = (item.id > 0) ? 'Update Contact' : 'Add New Contact';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.contact);
        }
        $scope.saveContact = function (contact) {
            product.uid = $scope.uid;
            if(product.id > 0){
                Data.put('contacts/'+product.id, product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                product.status = 'Active';
                Data.post('contacts', contact).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});
