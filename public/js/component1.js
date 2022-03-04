import Component2 from "./component2.js";

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
                //provide logic for displaying
                this.url = data.url;
                this.id = data.id;
                this.username = data.username;
                this.title = data.title;
                this.description = data.description;
            })
            .catch((err) => console.log("error in pulling image info", err));
    },
    components: {
        Component2,
    },
    props: ["imageId"],
    template: `
        <div class='component'>
            <img :src='url' alt='title' />
            <p class='component--img--info'>Uploaded by {{username}}</p>
            <p class='component--img--info'>{{title}}</p>
            <p class='component--img--info'>{{description}}</p>
            <Component2 :image-id='imageId' ></Component2>
            <div class='overlay' @click='this.$emit("closeDown");'></div>
        </div>
    `,
};

export default Component1;
