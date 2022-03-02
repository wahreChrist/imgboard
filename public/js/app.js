import * as Vue from "./vue.js";
import Component1 from "./component1.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            show: 0,
        };
    },
    mounted: function () {
        //place where you need to retrieve data for an initial render
        fetch("/images.json")
            .then((response) => response.json())
            .then(({ rows }) => {
                this.images = rows;
            })
            .catch((err) => console.log(err));
    },
    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
        },
        upload: function (e) {
            const fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);
            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((resp) => resp.json())
                .then((data) => {
                    console.log("returned data from upload req", data);
                    this.images.unshift(data);
                })
                .catch((err) => console.log("error in /upload", err));
        },
        display: function (e) {
            console.log(e.target.getAttribute("id")); // returns image id
            this.show = e.target.getAttribute("id");
        },
        toggle: function () {
            this.show = 0;
        },
    },
    components: {
        Component1,
    },
});
app.mount("#main");
