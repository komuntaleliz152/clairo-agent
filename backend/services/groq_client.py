import os
from groq import Groq
from typing import List, Dict

class GroqClient:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"  # Fast and capable model
    
    def generate_response(self, messages: List[Dict[str, str]]) -> str:
        """
        Generate a response from Groq AI
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
        
        Returns:
            Generated text response
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=2000,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    def generate_research_report(self, topic: str, search_results: str = None) -> str:
        """
        Generate a research report on a given topic
        
        Args:
            topic: Research topic
            search_results: Optional web search results
        
        Returns:
            Formatted research report
        """
        system_prompt = """You are an expert research assistant. Your task is to create comprehensive, 
        well-structured research reports. Include:
        - Executive Summary
        - Key Findings
        - Detailed Analysis
        - Conclusions
        - Sources (cite the numbered sources from the web results when provided)
        
        Format the report in a clear, professional manner. Be factual and base
        conclusions on the provided search results when available."""
        
        if search_results:
            user_prompt = f"""Research Topic: {topic}

Web Search Results:
{search_results}

Please analyze the above information and create a comprehensive research report."""
        else:
            user_prompt = f"""Research Topic: {topic}

Please create a comprehensive research report on this topic based on your knowledge."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return self.generate_response(messages)
