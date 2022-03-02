const Component1 = {
    data() {
        return {
            id: "",
            url: "",
            username: "",
            title: "",
            description: "",
        };
    },
    mounted: function () {
        fetch(`/getImage/${this.imageId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("received image data on client side", data);
                //provide logic for displaying
                this.url = data.url;
                this.id = data.id;
                this.username = data.username;
                this.title = data.title;
                this.description = data.description;
            })
            .catch((err) => console.log("error in pulling image info", err));
    },
    props: ["imageId"],
    template: `
        <div class='component'>
            <img :src='url' alt='title' />
            <p>Uploaded by {{username}}</p>
            <p>{{title}}</p>
            <p>{{description}}</p>
            <div class='overlay' @click='this.$emit("closeDown");'></div>
        </div>
    `,
};

export default Component1;
