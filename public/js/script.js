
// Delete Book 
$('.deleteBookBtn').on('click',function(){
    if(confirm('Delete This Book')){

        let bookId = $(this).data('id');
        
        $.ajax({
            url:'/admin/delete-Book/'+bookId,
            type:"DELETE",
            success:function(response){
                alert(response);
                location.reload();
            }
        })
    }
})



// Delete Category
$('.deleteCategoryBtn').on('click',function(){
    if(confirm('Delete This Category')){

        let categoryId = $(this).data('id');
        
        $.ajax({
            url:'/admin/delete-category/'+categoryId,
            type:"DELETE",
            success:function(response){
                alert(response);
                location.reload();
            }
        })
    }
})





// rent book
$('.rentBtn').on('click',function(){
    let bookId = $(this).data('book-id');
    let userId = $(this).data('user-id');

    $.ajax({
        url:'/users/rent-book',
        type:'POST',
        data:{
            userId:userId,
            bookId:bookId,
        },
        success:function(response){
            alert(response);
            location = '/';
        }
    })
})



// return Book from rent
$('.returnBookBtn').on('click',function(){
    let bookId = $(this).data('book-id');
    let rentId = $(this).data('rent-id');
    let userId = $(this).data('user-id');
    
    $.ajax({
        url:'/users/return-book',
        type:'POST',
        data:{
            rentId:rentId,
            bookId:bookId,
            userId:userId,
        },
        success:function(response){
             alert(response);
             location = '/users/return-book';
        }
    })
})


