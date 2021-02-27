<template>
  <div id="indexblog">
    <LoadPage />
  </div>
</template>

<script>
import LoadPage from "@/components/LoadPage.vue";

//import octokit from "@/utils/octokit";
export default {
  name: "IndexBlog",
  components: {
    LoadPage,
  },
  mounted: function () {
    this.$store.dispatch('BLOG_LOAD_INIT')
    /*
    octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "FireUnicornser",
      repo: "govBlog",
    }).then(function(json){
      console.log(json.data)
    })
  */
  },
};
</script>
