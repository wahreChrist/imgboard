const Component2 = {
    data() {
        return {
            imageId: this.imageId,
            comments: [],
            username: "",
            comment: "",
        };
    },
    mounted: function () {
        fetch(`/comment/${this.imageId}`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((element) => {
                    this.comments.unshift(element);
                });
            })
            .catch((err) =>
                console.log("error in pulling comments for an image", err)
            );
    },
    methods: {
        uploadComment: function () {
            fetch(`/comment`, {
                method: "POST",
                body: JSON.stringify({
                    text: this.comment,
                    username: this.username,
                    image_id: this.imageId,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.comments.unshift(data);
                })
                .catch((err) => console.log("error in posting comment", err));
        },
    },
    props: ["imageId"],
    template: `
        <div class='component2'>
            <h4>Add a comment:</h4>
            <textarea name='comment' v-model='comment' placeholder='Add your comment here' id='comment' rows='5' columns='50' ></textarea>
            <input type='text' v-model='username' name='username' id='username' placeholder='username'>
            <button @click='uploadComment'>Submit comment</button>
            <div class='comments--field'>
                <div v-for='comment in comments'>
                    <p class='comment--text'>{{comment.text}}</p>
                    <p class='comment--creds'>{{comment.username}} on {{comment.created_at}}</p>
                </div>
            </div>
        </div>
        

    `,
};

export default Component2;
