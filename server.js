var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){

    Post.find({}, function(err, posts){
        
    })
    .populate('comments')
    .exec(function(err, post) {
      res.render('index', {posts: post});
        });
})

app.post('/add_post', function(req, res){
    var post = new Post({name: req.body.name, message: req.body.message});

    post.save(function(err) {
        if(err) {
        console.log('something went wrong');
        } 
        else { 
        console.log('successfully added a post');
        res.redirect('/');
        }
    })

})


app.post('/add_comment/:id', function(req, res){
    Post.findOne({_id: req.params.id}, function(err, post){
         var comment = new Comment({name: req.body.name, text: req.body.text});
         comment._post = post._id;
         post.comments.push(comment);
         comment.save(function(err){
                 post.save(function(err){
                       if(err) { console.log('Error'); } 
                       else { res.redirect('/'); }
                 });
         });
   });

})



app.listen(8000, function() {
    console.log("listening on port 8000");
})

mongoose.connect('mongodb://localhost/message_board');

var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
    name:{type: String, required: true, minlength: 4},
    message: {type: String, required: true }, 
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true });


var CommentSchema = new mongoose.Schema({
    _post: {type: Schema.Types.ObjectId, ref: 'Post'},
    name:{type: String, required: true, minlength: 2}, 
    text: {type: String, required: true }
}, {timestamps: true });

mongoose.model('Comment', CommentSchema);
mongoose.model('Post', PostSchema);
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');






