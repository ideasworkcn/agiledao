package com.ideaswork.scrum.presentation;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "ping")
@RestController
public class TestController {

    @GetMapping("ping")
    @ApiOperation("ping")
    public String getId() {
        return "pong";
    }

    @ApiOperation("version")
    @GetMapping("version")
    public String getVersion() {
        return "1.1.0";
    }


}
