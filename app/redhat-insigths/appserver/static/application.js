if(Splunk.Module.SimpleResultsTable) {
    var orig = Splunk.Module.SimpleResultsTable.prototype.onResultsRendered;
    Splunk.Module.SimpleResultsTable.prototype.onResultsRendered = function() {
        orig.call(this);
        $('th', this.container).each(function(i, el){
            if(/^_raw\s*$/.test($(el).text())) $(el).hide();
        });
        $('td[field=_raw]', this.container).hide();
    }
}