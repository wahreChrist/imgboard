const Component2 = {
    data() {
        return {
            imageId: this.id,
            comments: [],
            username: "Anonymous",
            comment: "",
        };
    },
    mounted: function () {
        fetch(`/comment/${this.id}`)
            .then((response) => response.json())
            .then((data) => {
                // console.log("comment obj", data);
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
                    this.comments.push(data);
                    this.comment = "";
                    this.username = "Anonymous";
                })
                .catch((err) => console.log("error in posting comment", err));
        },
    },
    props: ["id"],
    template: `
        <div class='component2'>
            <div v-for='comment in comments'>
                <div class='comments--field'>
                    <p class='comment--creds'><span class='user'>{{comment.username}}</span> on {{comment.created_at}}</p>
                    <p class='comment--text'>{{comment.text}}</p>
                </div>
            </div>
            <div class='comment--form'>
                <h4>Post a reply:</h4>
                <textarea name='comment' v-model='comment' placeholder='Add your comment here' id='comment' rows='5' columns='50' ></textarea>
                <input type='text' v-model='username' name='username' id='username' placeholder='username'>
                <button @click.prevent.default='uploadComment'>Submit reply</button>
            </div>
        </div>
        

    `,
};

export default Component2;
