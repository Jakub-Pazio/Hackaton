<script>
function getData() {
    fetch('/action')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      let objects = data.allTasks;
      return objects;
    })
    .catch(error => {
      // Handle any errors
      console.error('Error:', error);
    })
    }
</script>