package com.example.demo;

public class UserSolveProblem {
	private String userId;
	private String problemName;
	private String state;
	private int solveCount;
	private int totalCount;
	
	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setProblemName(String problemName) {
		this.problemName = problemName;
	}
	
	public void setState(String state) {
		this.state = state;
	}

	public void setSolveCount(int scount) {
		this.solveCount = scount;
	}
	
	public void setTotalCount(int tcount) {
		this.totalCount = tcount;
	}
	
	
	public String getUserId() {
		return this.userId;
	}

	public String getProblemName() {
		return this.problemName ;
	}
	
	public String getState() {
		return this.state;
	}

	public int getSolveCount() {
		return this.solveCount;
	}
	
	public int getTotalCount() {
		return this.totalCount;
	}
	
}
