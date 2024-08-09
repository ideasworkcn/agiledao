package com.ideaswork.scrum.infrastructure.utils;


public class IdGenerator {
    public static String generateNextEpic(String lastEpic) {
        if (lastEpic == null) {
            return "EPIC-1";
        }
        String lastIdStr = lastEpic.replaceAll("[^0-9]", "");
        int lastId = Integer.parseInt(lastIdStr);
        int nextId = lastId + 1;
        return "EPIC-" + nextId;
    }

    public static String generateNextFeature(String lastFeature) {
        if (lastFeature == null) {
            return "FEATURE-1";
        }
        String lastIdStr = lastFeature.replaceAll("[^0-9]", "");
        int lastId = Integer.parseInt(lastIdStr);
        int nextId = lastId + 1;
        return "FEATURE-" + nextId;
    }


    public static String generateNextBacklog(int backlogNum) {
        int nextId = backlogNum + 1;
        return "BACKLOG-" + nextId;
    }

    public static String generateNextTask(int  taskNum) {
        int nextId = taskNum + 1;
        return "TASK-" + nextId;
    }

    public static String generateNextSprint(int sprintNum) {

        int nextId = sprintNum + 1;
        return "SPRINT-" + nextId;
    }

    public static String generateNextMeeting(String lastMeeting) {
        if (lastMeeting == null) {
            return "MEETING-1";
        }
        String lastIdStr = lastMeeting.replaceAll("[^0-9]", "");
        int lastId = Integer.parseInt(lastIdStr);
        int nextId = lastId + 1;
        return "MEETING-" + nextId;
    }


}
