import json
import re

def convert_txt_to_json(txt_file, json_file):
    with open(txt_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # 分割每道题
    questions = re.split(r'\n\s*\d+\.', content)
    questions = [q.strip() for q in questions if q.strip()]

    results = []

    for q in questions:
        # 题目和选项的提取
        question_match = re.search(r'(.*?)\n', q, re.DOTALL)
        if not question_match:
            continue
        question_text = question_match.group(1).strip()

        options_match = re.findall(r'[A-F][．.](.*?)\n', q, re.DOTALL)
        options = [option.strip() for option in options_match]

        # 答案和出处的提取
        answer_match = re.search(r'参考答案：([A-F]+)', q)
        explanation_match = re.search(r'出处：(.*)', q)

        if not answer_match or not explanation_match:
            continue
        
        answer = answer_match.group(1).strip()
        explanation = explanation_match.group(1).strip()
        answer_num = len(answer)

        results.append({
            "question": question_text,
            "options": options,
            "answer": answer,
            "explanation": explanation,
            "answer_num": answer_num
        })

    # 写入 JSON 文件
    with open(json_file, 'w', encoding='utf-8') as jsonf:
        json.dump(results, jsonf, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    convert_txt_to_json('questions.txt', 'questions.json')
