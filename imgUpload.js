;
(function ($) {
  //图片预览
  function previewImg(file, callback) {
    var reader = new FileReader();
    var img = new Image();

    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    img.onload = function () {
      callback(img)
    }
  }

  function init(options) {
    var defaluts = {
      size: 3 * 1024 * 1024,
      len: 1,
      type: 'uploadImg' || 'setCover',
      uploadUrl: '', //上传路径
      deleteUrl: '', //删除路径
      onSuccess: function () {},
      onError: function () {} //失败回调
    };
    var opts = $.extend({}, defaluts, options);

    var $btnUpload = $(this).find('.upload-button');
    var $imgItemsList = $(this).find('.uploaded-list');
    var $imgItem = $imgItemsList.find('.uploaded-item');

    if ($imgItem.length == opts.len) $btnUpload.hide();

    // 上传图片
    $btnUpload.on('change', 'input[type="file"]', function (e) {
      if (!e.target.files.length) return;

      var file = e.target.files[0];

      if (file.size > opts.size) {
        alert('图片尺寸不能大于' + (opts.size / (1024 * 1024)).toFixed(2) + 'M!');
        return;
      } else {
        // submitImg(file)
        renderImgItem(file, 2);
      }
    })

    // 删除图片
    $imgItemsList.on('click', '.btn-close', function (e) {
      e.preventDefault();
      $(this).parent().off().remove();
      $btnUpload.show();
    });

    // 设置封面 
    $imgItemsList.on('click', '.btn-set-cover', function (e) {
      e.preventDefault();
      $imgItemsList.prepend($(this).parent());
    });

    // render图片
    function renderImgItem(file, id) {
      var html = '';
      switch (opts.type) {
        case 'setCover':
          html = '<li class="uploaded-item" data-id="' + id + '">' +
            '<a class="btn-close"></a></li>';
          break;
        case 'uploadImg': 
          html = '<li class="uploaded-item" data-id="' + id + '">' +
            '<a class="btn-close"></a>' +
            '<a class="btn-set-cover"></a></li>';
        break;
      }
      var $li = $(html);

      previewImg(file, function (img) {
        $(img).appendTo($li);
        $li.appendTo($imgItemsList);
        if ($imgItemsList.children().length == opts.len) $btnUpload.hide();
      });
    }

    // 图片上传服务器
    function submitImg(file) {
      var form = new FormData();
      form.append('file', file);

      $.ajax({
        url: opts.url,
        type: 'POST',
        processData: false, // 用于对data参数进行序列化处理 这里必须false
        contentType: false, // 必须
        data: form,
        success: function (data) {
          opt.onSuccess(data);
          renderImgItem(data);
        },
        error: function (err) {
          opts.onError(err);
        }
      })
    }
  }

  // 上传关键图片 
  $.fn.imgUpload = function (options) {
    return this.each(function () {
      init.call(this, options);
    })
  }
  // 设置封面
  $.fn.setCover = function (options) {
    return this.each(function () {
      init.call(this, options);
    })
  }
})(jQuery);