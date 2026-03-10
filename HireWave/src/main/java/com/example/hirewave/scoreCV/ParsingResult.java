package com.example.hirewave.scoreCV;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ParsingResult {
    private int score;
    private List<String> issues; // lỗi phát hiện
    private List<String> suggestions; //gợi ý sửa 
}
