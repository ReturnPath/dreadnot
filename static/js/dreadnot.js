


function streamLogs(log) {
  var socket = io.connect(),
      logPath = ['stacks', log.stack, 'regions', log.region, 'deployments', log.deployment, 'log'].join('.'),
      endPath = ['stacks', log.stack, 'regions', log.region, 'deployments', log.deployment, 'end'].join('.');

  socket.on(logPath, function(entry) {
    var dest = $('pre.deployment_log'),
        scroll = Math.abs(dest[0].scrollTop - (dest[0].scrollHeight - dest[0].offsetHeight)) < 10,
        line, table;

    if (entry.lvl <= 3) {
      line = $('<p class="error">' + entry.msg + '</p>');
    } else {
      line = $('<p>' + entry.msg + '</p>');
    }

    table = $('<div class="bordered-table condensed-table"><table><tbody>' + Object.keys(entry.obj).map(function(key) {
      var val;

      if (key === 'err') {
        val = entry.obj[key].stack;
      } else {
        val = entry.obj[key];
      }

      return '<tr><td class="key">' + key + '</td><td>' + val + '</td></tr>';
    }).join('') + '</tbody></table></div>');

    line.click(function() {
      table.slideToggle('fast', 'swing');
    });

    dest.append(line);
    dest.append(table);

    if (scroll) {
      dest[0].scrollTop = dest[0].scrollHeight;
    }
  });

  socket.on(endPath, function(success) {
    var last = $('pre.deployment_log p').last();

    if (success) {
      last.addClass('success');
    } else {
      last.addClass('error');
    }
  });

  socket.once('connect', function() {
    socket.emit('request log', log);
  });
}


function dreadNow() {
  $('#dread-now').modal({
    keyboard: true,
    backdrop: 'static'
  });

  $('#deploy-form').submit(function(event) {
    if ($('#wack').val() !== 'true') {
      event.preventDefault();
      $('#dread-now').modal('show');
    } else {
      return true;
    }
  });

  $('#fearless').click(function(event) {
    $('#dread-now').modal('hide');
    $('#wack').val('true');
    $('#deploy-form').submit();
  });

  $('#fearful').click(function(event) {
    $('#dread-now').modal('hide');
  });
}
