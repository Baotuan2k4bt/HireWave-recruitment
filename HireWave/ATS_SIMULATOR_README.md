# ATS Simulator - Rule-based CV Evaluation

## Tổng quan

ATS Simulator là một hệ thống đánh giá CV dựa trên rule-based logic, mô phỏng cách các Applicant Tracking Systems (ATS) đọc và chấm điểm CV.

## Kiến trúc

### 1. ATSVocabulary.java
**Vocabulary/Dictionary cho đa ngôn ngữ**

Chứa tất cả các từ khóa, patterns, và rules:
- **Section Headings**: Skills, Education, Experience, Projects (VN/EN)
- **Action Verbs**: developed, built, optimized... (VN/EN)
- **Metric Keywords**: %, users, ms, revenue... (VN/EN)
- **Patterns**: Email, Phone, Section headings, Numbers
- **Scoring Constants**: Weights, thresholds, limits

**Mở rộng dễ dàng**: Chỉ cần thêm từ khóa vào các list tương ứng.

### 2. ParsingScorerServiceImpl.java
**Core ATS Simulator Logic**

#### 5 Tiêu chí chấm điểm:

**A) Contact Information (25 điểm)**
- Email: Regex pattern detection
- Phone: Flexible pattern detection
- HIGH priority: Thiếu contact info trừ điểm mạnh

**B) CV Structure (20 điểm)**
- Detect sections: Skills, Education, Experience, Projects
- Heading detection: Pattern matching trên từng dòng
- Fallback: Keyword matching trong toàn bộ text
- Fresher-friendly: Có Projects bù đắp cho thiếu Experience

**C) Content Length (15 điểm)**
- < 100 từ: 0 điểm (quá ngắn)
- 100-150 từ: 7 điểm (hơi ngắn)
- 150-800 từ: 15 điểm (tối ưu)
- 800-900 từ: 12 điểm (hơi dài)
- > 900 từ: 9 điểm (quá dài)

**D) Header Placement (10 điểm)**
- Contact info trong 300 ký tự đầu: 10 điểm
- Contact info có nhưng không ở đầu: 5 điểm
- Không có contact info: 0 điểm

**E) Content Impact (30 điểm)**
- Action verbs: Count occurrences
- Metrics: %, numbers, metric keywords
- 5+ action verbs + 3+ metrics: 30 điểm
- 3+ action verbs + 2+ metrics: 24 điểm
- 2+ action verbs hoặc 1+ metrics: 15 điểm
- Không có: 6 điểm

#### Scoring Principles:
- **Không bonus dễ dãi**: Score thực tế 60-95
- **Trừ điểm theo lỗi**: Mỗi lỗi trừ điểm tương ứng
- **Weighted scoring**: Mỗi tiêu chí có weight riêng

### 3. ParsingResultV2.java
**Enhanced Result Structure**

```java
- score: int (0-100)
- levelLabel: String ("Xuất sắc" / "Tốt" / "Trung bình" / "Yếu")
- verdict: String ("Đạt" / "Cần cải thiện" / "Không đạt")
- issues: List<String> (HIGH priority first)
- suggestions: List<String> (prioritized: HIGH -> MEDIUM -> LOW, max 5)
- strengths: List<String> (điểm mạnh)
- weaknesses: List<String> (điểm yếu)
- breakdown: Map<String, Integer> (scores theo từng tiêu chí)
- uiHints: Map<String, Object> (thông tin hỗ trợ UI)
```

### 4. ParsingController.java
**REST API Endpoints**

- `POST /api/candidate-ai/parsing/evaluate-text` - Legacy (ParsingResult)
- `POST /api/candidate-ai/parsing/evaluate-text-v2` - Enhanced (ParsingResultV2)
- `POST /api/candidate-ai/parsing/evaluate-pdf` - Enhanced với PDF parsing

## Logic Flow

```
1. Input: extractedText (String)
   ↓
2. Normalize text (lowercase, remove extra whitespace)
   ↓
3. Evaluate 5 criteria:
   - Contact Info (email, phone)
   - Structure (sections)
   - Length (word count)
   - Header (placement)
   - Impact (metrics, action verbs)
   ↓
4. Calculate scores for each criterion
   ↓
5. Sum scores (max 100)
   ↓
6. Determine levelLabel and verdict
   ↓
7. Generate strengths, weaknesses, suggestions
   ↓
8. Prioritize suggestions (HIGH -> MEDIUM -> LOW)
   ↓
9. Limit suggestions to 5
   ↓
10. Generate UI hints
   ↓
11. Return ParsingResultV2
```

## Scoring Rules

### Contact Information (25 điểm)
- Có email + phone: 25 điểm
- Chỉ có email hoặc phone: 12 điểm
- Không có: 0 điểm

### Structure (20 điểm)
- 4 sections: 20 điểm
- 3 sections: 16 điểm
- 2 sections: 10 điểm
- 1 section: 4 điểm
- Fresher có Projects: Không trừ quá nặng

### Length (15 điểm)
- 150-800 từ: 15 điểm (tối ưu)
- 100-150 từ: 7 điểm
- < 100 từ: 0 điểm
- 800-900 từ: 12 điểm
- > 900 từ: 9 điểm

### Header (10 điểm)
- Contact info trong 300 ký tự đầu: 10 điểm
- Contact info có nhưng không ở đầu: 5 điểm
- Không có: 0 điểm

### Impact (30 điểm)
- 5+ action verbs + 3+ metrics: 30 điểm
- 3+ action verbs + 2+ metrics: 24 điểm
- 2+ action verbs hoặc 1+ metrics: 15 điểm
- Không có: 6 điểm

## Level Labels & Verdicts

- **Xuất sắc** (85-100): "Đạt"
- **Tốt** (70-84): "Đạt"
- **Trung bình** (50-69): "Cần cải thiện"
- **Yếu** (0-49): "Không đạt"

## Suggestions Priority

1. **HIGH**: Critical issues (thiếu contact, thiếu sections, quá ngắn)
2. **MEDIUM**: Important improvements (thiếu metrics, cấu trúc chưa đầy đủ)
3. **LOW**: Nice-to-have (header placement, rút gọn)

## Multi-language Support

- **Vietnamese**: Hỗ trợ đầy đủ
- **English**: Hỗ trợ đầy đủ
- **Extensible**: Dễ dàng thêm ngôn ngữ khác (JP, KR) vào ATSVocabulary

## Robustness

- **Normalize text**: Lowercase, remove extra whitespace, unify punctuation
- **Handle unicode**: Tiếng Việt được xử lý tốt
- **Empty/null handling**: Không crash với text ngắn/empty
- **Pattern matching**: Flexible regex patterns

## Performance

- **Compiled patterns**: Patterns được compile một lần, reuse nhiều lần
- **Efficient matching**: Stream-based keyword matching
- **No database**: Pure in-memory processing

## Testing

Xem file `ATS_SIMULATOR_EXAMPLES.md` để có ví dụ output JSON cho:
- CV tốt (87 điểm)
- CV yếu (42 điểm)
- CV trung bình (65 điểm)
- CV fresher (58 điểm)
- CV fresher với projects (72 điểm)

## Mở rộng

### Thêm ngôn ngữ mới:
1. Thêm keywords vào ATSVocabulary (ví dụ: JP_SKILLS_HEADINGS)
2. Thêm vào ALL_* lists
3. Không cần sửa logic scoring

### Thêm tiêu chí mới:
1. Thêm weight vào ATSVocabulary
2. Implement logic trong ParsingScorerServiceImpl
3. Thêm vào breakdown map
4. Cập nhật UI hints nếu cần

### Tùy chỉnh scoring:
1. Điều chỉnh weights trong ATSVocabulary
2. Điều chỉnh thresholds
3. Thêm bonus/penalty rules

## Best Practices

1. **Rule-based, not ML**: Dễ hiểu, dễ debug, dễ maintain
2. **Multi-language**: Hỗ trợ VN/EN từ đầu
3. **Realistic scoring**: 60-95 range, không dễ dãi
4. **Prioritized suggestions**: HIGH -> MEDIUM -> LOW
5. **Fresher-friendly**: Không penalize quá nặng freshers
6. **ATS-focused**: Mô phỏng cách ATS thật đọc CV
