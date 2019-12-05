let homePage = new Vue({
    el: "#home",
    data: {
        blog_msg: [],
        blog_timeYear: new Date().getFullYear(),
        blog_count: [0, 0, 0],
        total_count: 0
    },
    mounted: function () {
        this.getAllBlog();
        loadEl();
    },
    methods: {
        transMsg: function (data) {
            let year_now = 0,
                year_i = -1,
                blog_i = 0,
                year, blogs = [];
            $.each(data, function (idx, value) {
                let addTime = new Date(value.addTime);
                year = addTime.getFullYear();
                if (year !== year_now) {
                    year_now = year;
                    Vue.set(homePage.blog_count, year_i, blog_i);
                    year_i++;
                    homePage.total_count += blog_i;
                    blog_i = 0;
                    blogs.push([]);
                }
                blogs[year_i].push(new Object({
                    id: value.id,
                    title: value.title,
                    url: rootsrc + "home/blogdetail/" + value.id,
                    time: addTime
                }));
                blog_i++;
            });
            Vue.set(homePage.blog_count, year_i, blog_i);
            homePage.total_count += blog_i;
            homePage.blog_msg = blogs;
        },
        getAllBlog: function () {
            let filter = {
                id: -1,
                needReturn: "111010"
            };
            $.ajax({
                url: rootsrc + 'api/blog',
                type: "get",
                contentType: "application/json",
                dataType: "json",
                data: {
                    jsonFilter: JSON.stringify(filter)
                },
                success: function (blogData) {
                    homePage.transMsg(blogData);
                }
            });
        },
        linkTo: function (url) {
            Window.location.href = url;
        },
        getCount: function (id) {
            return homePage.blog_msg[id][0].addTime.getFullYear() + '年共' + homePage.blog_msg[id].length + '篇';
        }
    }
});

Vue.component('blog-msg', {
    props: {
        title: "",
        url: ""
    },
    template: '<div class="blog-detail"><div class="archive-vertical-line"></div><a :href="url">{{title}}</a></div>'
});

Vue.component('blog-year', {
    props: {
        count: "",
        year: ""
    },
    template: '<div class="article">  \
                    <div class="time-stamp"> \
                        <p>{{addYear}}</p> \
                        <hr /> \
                        <p>{{addMonthDay}}</p> \
                    </div> \
                    <div class="art-content" @click="linkTo(url)"> \
                        <a :href="url"><div class="art-title">{{title}}</div></a> \
                        <a :href="url"><div class="art-ellipsis">{{ellipsisContent}}</div></a> \
                    </div> \
                </div>'
});