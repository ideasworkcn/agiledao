package com.ideaswork.scrum.domain.task;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BurnDownDTO {

        @JsonFormat(pattern = "yyyy-MM-dd")
        private Date date;

        private int remainingHours;

}
