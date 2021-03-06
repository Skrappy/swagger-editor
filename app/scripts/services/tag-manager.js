'use strict';

SwaggerEditor.service('TagManager', function TagManager($stateParams) {
  var tags = [];

  function Tag(name, description) {
    this.name = name;
    this.description = description;
  }

  this.resetTags = function resetTags() {
    tags = [];
  };

  this.tagIndexFor = function (tagName) {
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name === tagName) {
        return i;
      }
    }
  };

  this.getAllTags = function () {
    return tags;
  };

  this.registerTagsFromSpecs = function (spec) {
    if (!angular.isObject(spec)) {
      return;
    }

    tags = [];

    if (Array.isArray(spec.tags)) {
      spec.tags.forEach(function (tag) {
        if (tag && angular.isString(tag.name)) {
          registerTag(tag.name, tag.description);
        }
      });
    }

    _.each(spec.paths, function (path) {
      _.each(path, function (operation) {
        _.each(operation.tags, registerTag);
      });
    });
  };

  this.getCurrentTags = function () {
    if ($stateParams.tags) {
      return $stateParams.tags.split(',');
    }
    return [];
  };

  function registerTag(tagName, tagDescription) {
    if (!tagName) {
      return;
    }
    var tagNames = tags.map(function (tag) {
      return tag.name;
    });
    if (!_.include(tagNames, tagName)) {
      tags.push(new Tag(tagName, tagDescription));
    }
  }

  this.registerTag = registerTag;
});
