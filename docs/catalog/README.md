# 모의고사 분석 카탈로그 (A4 · 8페이지)

영어 모의고사 45문항 채점 · 등급 분포 · 회차별 추세 · 문항별 정답률을 보여 주는 학원 성적 분석 웹앱 소개 카탈로그입니다.

- `Mock Exam Analysis Catalog.dc.html` : 카탈로그 원본 (doc-page / image-slot 컴포넌트, `_ds/` 디자인 시스템)
- `Mock Exam Analysis Catalog.pdf` : 인쇄·배포용 PDF (GIF는 대표 프레임으로 출력)
- `assets-mock/` : 앱 화면 캡처, 입력 흐름 GIF, 문의 QR(메일)

화면은 예시 학원 ‘데모 영어학원’과 예시 학생 9명의 3·6·9월 모의고사 결과 25건으로 캡처했습니다. 학원·학생 정보와 점수는 예시입니다.

## 미리보기

```bash
cd docs/catalog
python -m http.server 8099
# http://localhost:8099/Mock%20Exam%20Analysis%20Catalog.dc.html
```
