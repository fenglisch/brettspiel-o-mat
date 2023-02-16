/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
for (i = 0; i <= intParties - 1; i++) {
    var percent = fnPercentage(arResults[i], maxPoints);

    // bis v.0.3 mit PNG-Bildern, danach mit farblicher Bootstrap-Progressbar
    var barImage = fnBarImage(percent);

    // neu ab v.0.3 - Bootstrap-Progressbar
    $(`#partyBar${  i}`).width(`${percent  }%`);
    $(`#partyBar${  i}`).text(
      `${percent  }% (${  arResults[i]  } / ${  maxPoints  })`
    );
    $(`#partyBar${  i}`)
      .removeClass("bg-success bg-warning bg-danger")
      .addClass(barImage);

    $(`#partyPoints${  i}`).html(`${arResults[i]  }/${  maxPoints}`);
  }