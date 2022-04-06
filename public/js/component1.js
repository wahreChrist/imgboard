import Component2 from "./component2.js";

const Component1 = {
    data() {
        return {
            id: "",
            url: "",
            username: "",
            title: "",
            description: "",
            isActive: false,
        };
    },
    mounted: function () {
        fetch(`/getImage/${this.imageId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length == 0) {
                    history.replaceState({}, "", "/");
                } else {
                    this.url = data.url;
                    this.id = data.id;
                    this.username = data.username;
                    this.title = data.title;
                    this.description = data.description;
                }
            })
            .catch((err) => console.log("error in pulling image info", err));
    },
    methods: {
        toggle: function () {
            this.isActive = false;
            this.$emit("close");
        },
    },
    components: {
        Component2,
    },
    props: ["imageId"],
    template: `
        <div class='component'>
            <div class='close'>
                <img class='minus--btn' src='/minus.png' @click='toggle' ><p class='close--text'> Close thread</p>
            </div>
            <Component2 :id='imageId' ></Component2>
            
        </div>
    `,
};

export default Component1;
