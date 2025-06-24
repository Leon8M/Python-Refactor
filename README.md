
# 🪄 Python Refactor AI

A simple yet powerful web app that uses **Google's Gemini AI** to refactor, explain, or add comments to your Python code — instantly.

🔗 [Try the App](https://python-refactor.vercel.app)

---

## 🚀 Features

- 🧼 **Refactor Code**  
  Improve code readability and follow Python best practices (like PEP8).

- 💬 **Add Comments**  
  Auto-generate inline comments and docstrings for better code documentation.

- 🧠 **Explain Code**  
  Get a step-by-step explanation of what a Python function or snippet does.

---

## 🛠️ Tech Stack

- **Next.js (App Router)** – Full-stack framework (API + frontend in one)
- **Tailwind CSS** – For fast, modern styling
- **Google Gemini API** – For code generation and understanding
- **Prism.js** – For Python syntax highlighting
- **Vercel** – Hosting and deployment

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Leon8M/Python-Refactor.git
cd python-refactor-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app locally.

---

## 🧪 Example Input

```python
def calculate_sum_and_product(numbers_list):
    s = 0
    p = 1
    for n in numbers_list:
        s += n
        p *= n
    return [s, p]
```

### Output (Refactored)

```python
def calculate_sum_and_product(numbers):
    total = sum(numbers)
    product = 1
    for num in numbers:
        product *= num
    return [total, product]
```

---

## ✨ Inspiration

After working on [Learn-With-AI](https://learn-with-ai.vercel.app), I wanted to sharpen my skills further by integrating AI into more practical tools — and this project was the result.  
Next.js keeps winning me over with its full-stack power in a single place.

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

## 📮 Feedback

Have suggestions or want to contribute?  
Feel free to open an issue or pull request!
