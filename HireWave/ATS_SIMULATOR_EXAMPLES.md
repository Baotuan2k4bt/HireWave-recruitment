# ATS Simulator - Ví dụ Output JSON

## 1. CV TỐT (Score: 87/100)

```json
{
  "score": 87,
  "levelLabel": "Xuất sắc",
  "verdict": "Đạt",
  "issues": [],
  "suggestions": [
    "LOW: Rút gọn CV, tập trung vào thông tin quan trọng nhất"
  ],
  "strengths": [
    "Có đầy đủ thông tin liên hệ (email và số điện thoại)",
    "CV có cấu trúc đầy đủ với tất cả các section quan trọng",
    "Độ dài CV phù hợp (150-800 từ)",
    "Thông tin liên hệ được đặt ở phần đầu CV (ATS-friendly)",
    "CV có nhiều số liệu và action verbs, thể hiện kết quả cụ thể"
  ],
  "weaknesses": [],
  "breakdown": {
    "contact": 25,
    "structure": 20,
    "length": 15,
    "header": 10,
    "impact": 30
  },
  "uiHints": {
    "atsReadability": 100,
    "contentImpact": 100,
    "wordCount": 450,
    "sectionCount": 4,
    "hasMetrics": true,
    "hasActionVerbs": true
  }
}
```

**Giải thích:**
- Contact: 25/25 - Có đầy đủ email và phone
- Structure: 20/20 - Có đủ 4 sections (Skills, Education, Experience, Projects)
- Length: 15/15 - 450 từ, trong khoảng tối ưu
- Header: 10/10 - Contact info ở đầu CV
- Impact: 30/30 - Nhiều action verbs và metrics

---

## 2. CV YẾU (Score: 42/100)

```json
{
  "score": 42,
  "levelLabel": "Yếu",
  "verdict": "Không đạt",
  "issues": [
    "Thiếu số điện thoại",
    "CV thiếu nhiều section quan trọng",
    "Nội dung CV quá ngắn (< 100 từ), khó đánh giá",
    "CV thiếu số liệu và action verbs, khó đánh giá tác động"
  ],
  "suggestions": [
    "HIGH: Thêm số điện thoại vào phần đầu CV",
    "HIGH: Thêm tiêu đề section rõ ràng (Skills, Education, Experience, Projects)",
    "HIGH: Bổ sung Projects/Experience và mô tả rõ công nghệ + kết quả",
    "HIGH: Thêm số liệu cụ thể (%, số lượng, thời gian) và action verbs (developed, optimized, increased...)"
  ],
  "strengths": [],
  "weaknesses": [
    "Thiếu thông tin liên hệ quan trọng",
    "Cấu trúc CV không đạt chuẩn ATS",
    "CV quá ngắn, thiếu thông tin chi tiết",
    "Nội dung CV mô tả chung chung, thiếu bằng chứng cụ thể"
  ],
  "breakdown": {
    "contact": 12,
    "structure": 4,
    "length": 0,
    "header": 0,
    "impact": 6
  },
  "uiHints": {
    "atsReadability": 32,
    "contentImpact": 20,
    "wordCount": 85,
    "sectionCount": 1,
    "hasMetrics": false,
    "hasActionVerbs": false
  }
}
```

**Giải thích:**
- Contact: 12/25 - Chỉ có email, thiếu phone
- Structure: 4/20 - Chỉ có 1 section
- Length: 0/15 - Chỉ 85 từ, quá ngắn
- Header: 0/10 - Contact info không ở đầu
- Impact: 6/30 - Không có metrics và ít action verbs

---

## 3. CV TRUNG BÌNH (Score: 65/100)

```json
{
  "score": 65,
  "levelLabel": "Trung bình",
  "verdict": "Cần cải thiện",
  "issues": [
    "CV thiếu một số section quan trọng",
    "Nội dung CV hơi ngắn (100-150 từ)"
  ],
  "suggestions": [
    "MEDIUM: Thêm các section còn thiếu (Skills, Education, Experience, Projects)",
    "MEDIUM: Bổ sung thêm chi tiết về kinh nghiệm và dự án",
    "MEDIUM: Viết lại các bullet point theo format 'Action + Metric + Result' (ví dụ: 'Tăng 30% hiệu suất', 'Giảm 50% thời gian xử lý')"
  ],
  "strengths": [
    "Có đầy đủ thông tin liên hệ (email và số điện thoại)",
    "CV có cấu trúc tốt với hầu hết các section cần thiết"
  ],
  "weaknesses": [
    "Cấu trúc CV chưa đầy đủ",
    "CV cần thêm chi tiết"
  ],
  "breakdown": {
    "contact": 25,
    "structure": 16,
    "length": 7,
    "header": 10,
    "impact": 15
  },
  "uiHints": {
    "atsReadability": 85,
    "contentImpact": 50,
    "wordCount": 120,
    "sectionCount": 3,
    "hasMetrics": false,
    "hasActionVerbs": true
  }
}
```

**Giải thích:**
- Contact: 25/25 - Đầy đủ
- Structure: 16/20 - Có 3/4 sections
- Length: 7/15 - Hơi ngắn (120 từ)
- Header: 10/10 - OK
- Impact: 15/30 - Có action verbs nhưng thiếu metrics

---

## 4. CV FRESHER (Score: 58/100)

```json
{
  "score": 58,
  "levelLabel": "Trung bình",
  "verdict": "Cần cải thiện",
  "issues": [
    "Thiếu cả kinh nghiệm và dự án",
    "CV thiếu số liệu và action verbs, khó đánh giá tác động"
  ],
  "suggestions": [
    "HIGH: Thêm ít nhất Projects/Capstone để thể hiện kỹ năng",
    "HIGH: Thêm số liệu cụ thể (%, số lượng, thời gian) và action verbs (developed, optimized, increased...)",
    "MEDIUM: Viết lại các bullet point theo format 'Action + Metric + Result'"
  ],
  "strengths": [
    "Có đầy đủ thông tin liên hệ (email và số điện thoại)",
    "CV có cấu trúc tốt với hầu hết các section cần thiết"
  ],
  "weaknesses": [
    "Không có bằng chứng về năng lực thực tế",
    "Nội dung CV mô tả chung chung, thiếu bằng chứng cụ thể"
  ],
  "breakdown": {
    "contact": 25,
    "structure": 16,
    "length": 12,
    "header": 10,
    "impact": 6
  },
  "uiHints": {
    "atsReadability": 85,
    "contentImpact": 20,
    "wordCount": 180,
    "sectionCount": 3,
    "hasMetrics": false,
    "hasActionVerbs": false
  }
}
```

**Giải thích:**
- Fresher không có Experience nhưng cũng không có Projects
- Cần thêm Projects/Capstone để bù đắp
- Thiếu metrics và action verbs

---

## 5. CV FRESHER VỚI PROJECTS (Score: 72/100)

```json
{
  "score": 72,
  "levelLabel": "Tốt",
  "verdict": "Đạt",
  "issues": [],
  "suggestions": [
    "LOW: Nhấn mạnh vai trò, tech stack và kết quả trong các dự án",
    "MEDIUM: Viết lại các bullet point theo format 'Action + Metric + Result'"
  ],
  "strengths": [
    "Có đầy đủ thông tin liên hệ (email và số điện thoại)",
    "CV có cấu trúc đầy đủ với tất cả các section quan trọng",
    "Có dự án/đồ án để bù đắp cho thiếu kinh nghiệm làm việc",
    "Độ dài CV phù hợp (150-800 từ)",
    "Thông tin liên hệ được đặt ở phần đầu CV (ATS-friendly)"
  ],
  "weaknesses": [
    "CV thiếu số liệu cụ thể và action verbs"
  ],
  "breakdown": {
    "contact": 25,
    "structure": 20,
    "length": 15,
    "header": 10,
    "impact": 15
  },
  "uiHints": {
    "atsReadability": 100,
    "contentImpact": 50,
    "wordCount": 320,
    "sectionCount": 4,
    "hasMetrics": false,
    "hasActionVerbs": true
  }
}
```

**Giải thích:**
- Fresher nhưng có Projects/Capstone
- Được đánh giá tích cực hơn
- Cần thêm metrics để tăng điểm Impact

---

## Cấu trúc Response cho Frontend

### Fields chính:
- `score`: 0-100
- `levelLabel`: "Xuất sắc" / "Tốt" / "Trung bình" / "Yếu"
- `verdict`: "Đạt" / "Cần cải thiện" / "Không đạt"
- `breakdown`: Map với 5 tiêu chí (contact, structure, length, header, impact)
- `uiHints`: Thông tin hỗ trợ render UI

### UI Rendering Suggestions:

1. **Progress Bar**: Dùng `score` và `levelLabel` để hiển thị
2. **Breakdown Chart**: Dùng `breakdown` để hiển thị radar/spider chart
3. **Strengths/Weaknesses**: Hiển thị dạng bullet list với icon
4. **Suggestions**: Hiển thị với priority badge (HIGH/MEDIUM/LOW)
5. **ATS Readability**: Dùng `uiHints.atsReadability` (0-100)
6. **Content Impact**: Dùng `uiHints.contentImpact` (0-100)

### Color Scheme:
- Xuất sắc (85+): Green
- Tốt (70-84): Blue
- Trung bình (50-69): Yellow
- Yếu (<50): Red
